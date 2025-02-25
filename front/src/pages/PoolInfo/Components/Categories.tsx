import { useTranslation } from "react-i18next";

const Categories = ({ categories }: { categories: any[] } ) => {
    const { t } = useTranslation();

    if (!categories) {
        return null;
    }

    return (
        <table className="table table-sm">
            <thead>
            <tr className="text-base-200 text-lg">
                <th className="text-leff">{t('pool.categories.category')}</th>
                <th>{t('pool.categories.weight')}</th>
            </tr>
            </thead>
            <tbody>
            {categories.map((category: any) => (
                <tr key={category.category} className="">
                <td className="">{t(category.category)}</td>
                <td className="">{category.weight}</td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}

export default Categories;