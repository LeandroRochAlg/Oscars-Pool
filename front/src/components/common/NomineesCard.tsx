import React, { useState } from "react";
import styles from "./NomineesCard.module.css";
import api from "../../libs/api";
import { AxiosError } from "axios";
import { Category } from "../../types/Category";
import Button from "./Button";
import { Nominee } from "../../types/Nominee";

interface NomineesCardProps {
  categories: Category[];
  sendRoute?: string;
}

const NomineesCard: React.FC<NomineesCardProps> = ({ categories, sendRoute }) => {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0); // Controls the current category index
  const [msg, setMsg] = useState<string>("");
  const [selectedNominee, setSelectedNominee] = useState<number | null>(null);

  const currentCategory = categories[currentCategoryIndex]; // Gets the current category

  console.log(categories);

  const navigateToNextCategory = () => {
    const nextIndex = currentCategoryIndex + 1 < categories.length ? currentCategoryIndex + 1 : 0;
    setCurrentCategoryIndex(nextIndex);
    setSelectedNominee(null); // Reset the selection when changing categories
  };

  const navigateToPreviousCategory = () => {
    const prevIndex = currentCategoryIndex - 1 >= 0 ? currentCategoryIndex - 1 : categories.length - 1;
    setCurrentCategoryIndex(prevIndex);
    setSelectedNominee(null); // Reset the selection when changing categories
  };

  const sendNominee = async () => {
    if (selectedNominee === null) {
      setMsg("Please select a nominee.");
      return;
    }

    try {
      const response = await api.post<string>(sendRoute || "/bet", {
        nomineeId: selectedNominee,
        categoryId: currentCategory._id,
      });
      setMsg("Nominee sent successfully.");
    } catch (error) {
      const axiosError = error as AxiosError;
      setMsg(axiosError.response?.data as string || "An unexpected error occurred.");
    }
  };

  return (
    <div className={styles.container}>
      <h3>{currentCategory.category}</h3>
      <div className={styles.navigation}>
        <Button onClick={navigateToPreviousCategory}>{"<"}</Button>
        <Button onClick={navigateToNextCategory}>{">"}</Button>
      </div>
      <div className={styles.nominees}>
        {currentCategory.nominees.map((nominee: Nominee) => (
          <div key={nominee.id} className={styles.nominee}>
            <p>{nominee.name} - {nominee.movieTitle}</p>
            <Button onClick={() => setSelectedNominee(nominee.id)}>Select</Button>
          </div>
        ))}
      </div>
      <Button onClick={sendNominee}>Send Nominee</Button>
      <p>{msg}</p>
    </div>
  );
};

export default NomineesCard;