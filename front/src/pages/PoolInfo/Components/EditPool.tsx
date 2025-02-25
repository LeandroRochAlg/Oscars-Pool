import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../../../libs/api";
import { AxiosError } from "axios";
import Button from "../../../components/common/Button";
import CategorySelector from "../../../components/common/CategorySelector";
import WeightAssigner from "../../../components/common/WeightAssigner";
import ErrorMessage from "../../../components/common/ErrorMessage";
import AreYouSure from "../../../components/common/AreYouSure";

type PoolForm = {
    name: string;
    description: string;
    public: boolean;
    categories: { category: string; weight: number }[];
};

const EditPool = ({ pool, fetchPool }: { pool: any, fetchPool: Function }) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [submitError, setSubmitError] = useState("");
    const [fetchError, setFetchError] = useState("");
    const [allCategories, setAllCategories] = useState<string[]>([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    // Validation schema
    const schema = yup.object().shape({
        name: yup.string().required(t("createPoolPage.errors.nameRequired")).max(50, t("createPoolPage.errors.nameMaxLength")),
        description: yup.string().max(5000, t("createPoolPage.errors.descriptionMaxLength")),
        public: yup.boolean().required(),
        categories: yup
            .array()
            .of(
                yup.object().shape({
                    category: yup.string().required(),
                    weight: yup.number().required().min(1, t("createPoolPage.errors.weightMin")),
                })
            )
            .min(1, t("createPoolPage.errors.atLeastOneCategory"))
            .test(
                "totalWeight",
                t("createPoolPage.errors.totalWeight"),
                (categories) => {
                    const totalWeight = categories?.reduce((sum, cat) => sum + (cat.weight || 0), 0);
                    return totalWeight === 1000;
                }
            ),
    });

    const {
        control,
        handleSubmit,
        register,
        setValue,
        watch,
        formState: { errors },
    } = useForm<PoolForm>({
        resolver: yupResolver(schema) as any,
        defaultValues: {
            name: "",
            description: "",
            public: true,
            categories: [],
        },
    });

    useEffect(() => {
        setLoadingCategories(true);
        setLoading(true);
        setFetchError("");

        const fetchCategories = async () => {
            if (pool) {
                setValue("name", pool.name);
                setValue("description", pool.description);
                setValue("public", pool.public);
                setValue("categories", pool.categories);

                try {
                    const categoriesResponse = await api.get("/categories");
                    setAllCategories(categoriesResponse.data);
                } catch (error) {
                    setFetchError(t('pool.editPool.errors.fetchCategoriesFailed'));
                }
            }
        };

        fetchCategories();
        setLoadingCategories(false);
        setLoading(false);
    }, [pool]);

    const onSubmit = async (data: PoolForm) => {
        setLoading(true);

        try {
            await api.put(`/pools/updatePool/${pool._id}`, {
                name: data.name,
                description: data.description,
                public: data.public,
                categories: data.categories,
            });

            fetchPool();
        } catch (error) {
            const axiosError = error as AxiosError;

            if (axiosError.response?.status === 500) {
                setSubmitError(t("pool.editPool.errors.submitError"));
            }
        }

        setLoading(false);
    };

    const handleDeletePool = async () => {
        setLoading(true);

        try {
            await api.delete(`/pools/deletePool/${pool._id}`);
            fetchPool();
        } catch (error) {
            setSubmitError(t("pool.errors.deleteError"));
        }

        setLoading(false);
    }

    if (!pool) {
        return null;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* General Information */}
            <div className="space-y-4">
                <input
                    type="text"
                    className="input input-bordered border-primary w-full text-sm text-base-200 placeholder:text-base-200"
                    placeholder={t("createPoolPage.form.name")}
                    {...register("name")}
                />
                {errors.name && <ErrorMessage error={errors.name.message || ""} />}

                <textarea
                    className="textarea textarea-bordered h-20 w-full border-primary text-sm text-base-200 placeholder:text-base-200"
                    placeholder={t("createPoolPage.form.description")}
                    {...register("description")}
                />
                {errors.description && <ErrorMessage error={errors.description.message || ""} />}

                <div className="h-10 flex items-center gap-2">
                    <label className="text-sm">{t("createPoolPage.form.public")}</label>
                    <Controller
                        name="public"
                        control={control}
                        render={({ field }) => (
                            <input
                                type="checkbox"
                                className="toggle toggle-primary"
                                checked={field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                            />
                        )}
                    />
                </div>
            </div>

            {/* Category Selection */}
            <div>
                {loadingCategories ? (
                    <>
                        <div className="skeleton w-full h-5 my-1"></div>
                        <div className="skeleton w-full h-5 my-1"></div>
                        <div className="skeleton w-full h-5 my-1"></div>
                        <div className="skeleton w-full h-5 my-1"></div>
                        <div className="skeleton w-full h-5 my-1"></div>
                        <div className="skeleton w-full h-5 my-1"></div>
                        <div className="skeleton w-full h-5 my-1"></div>
                        <div className="skeleton w-full h-7 my-1"></div>
                        <div className="skeleton w-full h-7 my-1"></div>
                        <div className="skeleton w-full h-7 my-1"></div>
                        <div className="skeleton w-full h-7 my-1"></div>
                        <div className="skeleton w-full h-7 my-1"></div>
                        <div className="skeleton w-full h-7 my-1"></div>
                    </>
                ) : (
                    <>                    
                        <div className="mt-6">
                            <CategorySelector
                                categories={allCategories}
                                selectedCategories={watch("categories")}
                                onSelect={(categories: { category: string; weight: number }[]) => setValue("categories", categories)}
                            />
                            {errors.categories && <ErrorMessage error={errors.categories.message || ""} />}
                        </div>

                        {/* Weight Assignment */}
                        <div className="mt-6">
                            <WeightAssigner
                                categories={watch("categories")}
                                onChange={(updatedCategories: { category: string; weight: number }[]) => setValue("categories", updatedCategories)}
                                error={errors.categories?.message}
                            />
                        </div>
                    </>
                )}
            </div>

            <div className="mt-6 flex justify-between items-center">
                {/* Submit Button */}
                <Button type="submit" loading={loadingCategories || loading}>
                    {t("pool.editPool.buttons.saveChanges")}
                </Button>

                {/* Delete Pool Button */}
                <button type="button" className="btn btn-error uppercase mx-auto" disabled={loading} onClick={() => setDeleteModalOpen(true)}>
                    {loading ? (<span className="loading loading-spinner"></span>) : t("pool.editPool.buttons.deletePool")}
                </button>
            </div>

            {/* Error Message */}
            {submitError && <ErrorMessage error={submitError || fetchError} />}

            {/* Delete Pool Modal */}
            <AreYouSure onYes={handleDeletePool} onNo={() => setDeleteModalOpen(false)} message={t("pool.editPool.areYouSure")} show={deleteModalOpen} />
        </form>
    );
}

export default EditPool;