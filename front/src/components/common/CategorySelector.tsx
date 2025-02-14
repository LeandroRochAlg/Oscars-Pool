import { useTranslation } from "react-i18next";

type CategoryPool = {
    category: string;
    weight: number;
};

type CategorySelectorProps = {
    categories: string[];
    selectedCategories: CategoryPool[];
    onSelect: (categories: CategoryPool[]) => void;
};

const CategorySelector = ({ categories, selectedCategories, onSelect }: CategorySelectorProps) => {
    const { t } = useTranslation();

    const handleCategoryChange = (category: string) => {
        const updatedCategories = selectedCategories.some((cat) => cat.category === category)
            ? selectedCategories.filter((cat) => cat.category !== category)
            : [...selectedCategories, { category, weight: 0 }];
        onSelect(updatedCategories);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {categories.map((category) => (
            <div key={category}>
                <label className="flex items-center">
                <input
                    className="checkbox mx-2 checkbox-primary"
                    type="checkbox"
                    checked={selectedCategories.some((cat) => cat.category === category)}
                    onChange={() => handleCategoryChange(category)}
                />
                {t(category)}
                </label>
            </div>
            ))}
        </div>
    );
};

export default CategorySelector;