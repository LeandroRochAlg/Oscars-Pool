import { useTranslation } from "react-i18next";
import { Pool } from "../../models/pool";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { useState, useEffect } from "react";
import api from "../../libs/api";
import { AxiosError } from 'axios';
import Title from "../../components/ui/Title";
import Button from "../../components/common/Button";
import CategorySelector from "../../components/common/CategorySelector";
import WeightAssigner from "../../components/common/WeightAssigner";
import ErrorMessage from "../../components/common/ErrorMessage";

type PoolForm = Pick<Pool, 'name' | 'description' | 'public'> & {
    categories: CategoryPool[];
};

type CategoryPool = {
    category: string;
    weight: number;
};

const CreatePool = () => {
    const { t } = useTranslation();
    const [step, setStep] = useState(1); // Current form step
    const [selectedCategories, setSelectedCategories] = useState<CategoryPool[]>([]);
    const [allCategories, setAllCategories] = useState<string[]>([]);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Validation schema with yup
    const schema = yup.object().shape({
        name: yup.string().required(t('createPoolPage.errors.nameRequired')).max(50, t('createPoolPage.errors.nameMaxLength')),
        description: yup.string().max(500, t('createPoolPage.errors.descriptionMaxLength')),
        public: yup.boolean().required(),
        categories: yup
            .array()
            .of(
                yup.object().shape({
                    category: yup.string().required(),
                    weight: yup.number().required().min(1, t('createPoolPage.errors.weightMin'))
                })
            )
            .min(1, t('createPoolPage.errors.atLeastOneCategory'))
            .test(
                'totalWeight',
                t('createPoolPage.errors.totalWeight'),
                (categories) => {
                    const totalWeight = categories?.reduce((sum, cat) => sum + (cat.weight || 0), 0);
                    return totalWeight === 1000;
                }
            )
    });

    const {
        control,
        handleSubmit,
        register,
        setValue,
        watch,
        formState: { errors }
    } = useForm<PoolForm>({
        resolver: yupResolver(schema) as any,
        defaultValues: {
            name: '',
            description: '',
            public: true,
            categories: []
        }
    });

    // Get all categories
    useEffect(() => {
        try {
            api.get('/categories')
                .then(response => {
                    setAllCategories(response.data);
                })
                .catch((error) => {
                    const axiosError = error as AxiosError;
                    console.error('Error getting categories:', axiosError.response?.data);
                });
        } catch (error) {
            console.error('Error getting categories:', error);
        }
    }, []);

    // Watch selected categories
    const categories = watch('categories');

    // Go to the next step
    const nextStep = () => {
        if (step < 3) {
            setStep(step + 1);
        }

        console.log(watch());
    };

    // Go to the previous step
    const prevStep = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    // Form submission
    const onSubmit = async (data: PoolForm) => {
        try {
            setLoadingSubmit(true);

            // Create the pool
            const response = await api.post('/pools/createPool', data);

            window.location.href = `/pools/${response.data._id}`;
        } catch (error) {
            const axiosError = error as AxiosError;
            setSubmitError((axiosError.response?.data as { message: string }).message);
            console.error('Error creating pool:', axiosError.response?.data);
        }

        setLoadingSubmit(false);
    };

    return (
        document.title = t('createPoolPage.title'),
        <div className="mx-2 md:max-w-[700px] md:mx-auto my-4 text-base-200">
            <Title>{t('createPoolPage.title')}</Title>

            {/* Breadcrumbs */}
            <div className="breadcrumbs text-md text-base-200 mb-6">
                <ul>
                    <li className={step === 1 ? 'font-bold' : ''}>
                        <a onClick={() => setStep(1)}>
                            {t('createPoolPage.pages.generalInfo')}
                        </a>
                    </li>
                    <li className={step === 2 ? 'font-bold' : ''}>
                        <a onClick={() => setStep(2)}>
                            {t('createPoolPage.pages.categories')}
                        </a>
                    </li>
                    <li className={step === 3 ? 'font-bold' : ''}>
                        <a onClick={() => setStep(3)}>
                            {t('createPoolPage.pages.weights')}
                        </a>
                    </li>
                </ul>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Step 1: General Information */}
                {step === 1 && (
                    <div className="space-y-4">
                        <input
                            type="text"
                            className="input input-bordered border-primary w-full text-sm text-base-200 placeholder:text-base-200"
                            placeholder={t('createPoolPage.form.name')}
                            {...register('name')}
                        />
                        <textarea
                            className="textarea textarea-bordered h-20 w-full border-primary text-sm text-base-200 placeholder:text-base-200"
                            placeholder={t('createPoolPage.form.description')}
                            {...register('description')}    
                        />
                        <div className="h-10 flex items-center gap-2">
                            <label className="text-sm">{t('createPoolPage.form.public')}</label>
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
                )}

                {/* Step 2: Category Selection */}
                {step === 2 && (
                    <CategorySelector
                        categories={allCategories}
                        selectedCategories={selectedCategories}
                        onSelect={(categories) => {
                            setSelectedCategories(categories);
                            setValue('categories', categories);
                        }}
                    />
                )}

                {/* Step 3: Weight Assignment */}
                {step === 3 && (
                    <WeightAssigner
                        categories={categories}
                        onChange={(updatedCategories) => {
                            setValue('categories', updatedCategories);
                        }}
                        error={errors.categories?.message}
                    />
                )}

                {/* Step Navigation */}
                <div className="flex justify-between mt-6">
                    {step > 1 && (
                        <Button type="button" onClick={prevStep}>
                            {t('createPoolPage.buttons.previous')}
                        </Button>
                    )}
                    {step < 3 ? (
                        <Button type="button" onClick={nextStep}>
                            {t('createPoolPage.buttons.next')}
                        </Button>
                    ) : (
                        <Button type="submit" loading={loadingSubmit}>
                            {t('createPoolPage.buttons.createPool')}
                        </Button>
                    )}
                </div>
            </form>

            {/* Error Message */}
            {submitError && <ErrorMessage error={submitError}/>}
        </div>
    );
};

export default CreatePool;