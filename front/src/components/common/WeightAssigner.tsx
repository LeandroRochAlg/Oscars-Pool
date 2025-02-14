import { useTranslation } from "react-i18next";

type CategoryPool = {
    category: string;
    weight: number;
};

type WeightAssignerProps = {
    categories: CategoryPool[];
    onChange: (categories: CategoryPool[]) => void;
    error?: string;
};

const WeightAssigner = ({ categories, onChange, error }: WeightAssignerProps) => {
    const { t } = useTranslation();

    const handleWeightChange = (index: number, weight: number) => {
        const updatedCategories = [...categories];
        updatedCategories[index].weight = weight;
        onChange(updatedCategories);
    };

    return (
        <div className="space-y-4">
            {categories.map((cat, index) => (
                <div key={cat.category} className="flex items-center gap-2">
                    <label>{t(cat.category)}</label>
                    <input
                        className="input input-primary input-sm w-20 ml-auto mr-0"
                        type="number"
                        value={cat.weight}
                        onChange={(e) => handleWeightChange(index, parseInt(e.target.value))}
                    />
                </div>
            ))}

            {/* Show the total weight */}
            <div className="text-right text-lg">
                <label className="font-bold">Total: </label>
                <span>{categories.reduce((acc, cat) => acc + cat.weight, 0)}</span>
            </div>
            
            {error && <p className="text-error">{error}</p>}
        </div>
    );
};

export default WeightAssigner;