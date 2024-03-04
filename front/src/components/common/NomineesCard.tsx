import { useState } from "react";
import styles from "./NomineesCard.module.css";
import api from "../../libs/api";
import { AxiosError } from "axios";
import { Category } from "../../types/Category";
import Button from "./Button";
import { Nominee } from "../../types/Nominee";

interface NomineesCardProps {
  category: Category;
  sendRoute?: string;
}

const NomineesCard = (CardProps: NomineesCardProps) => {
  const [msg, setMsg] = useState<string>("");
  const [selectedNominee, setSelectedNominee] = useState<number | null>(null);
  const { category, sendRoute } = CardProps;

  const sendNominee = async () => {
    if (selectedNominee === null) {
      setMsg("Please select a nominee.");
      return;
    }

    try {
      const response = await api.post<string>(sendRoute || "/bet", {
        nomineeId: selectedNominee,
        categoryId: category._id,
      });

      if(response.status === 201 || response.status === 200){
        setMsg("Nominee sent successfully.");

        // Send back to the page so the user can see the updated bets
        window.location.href = "/bets";
        
        // Reset the selected nominee
        setSelectedNominee(null);
      }else{
        setMsg("An unexpected error occurred.");
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      setMsg(axiosError.response?.data as string || "An unexpected error occurred.");

      if (axiosError.response?.status === 401 || axiosError.response?.status === 400) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.category}>{category.category}</h3>
      <div className={styles.nominees}>
        {category.nominees.map((nominee: Nominee) => (
          <div key={nominee.id} className={styles.nominee}>
            <button
              onClick={() => setSelectedNominee(nominee.id)}
              className={`${styles.nomineeButton} ${selectedNominee === nominee.id ? styles.selected : ""} ${nominee.userBet ? styles.userBet : ""}`}
            >
              <p className={styles.nomineeMovie}>{nominee.movieTitle}</p>
              <p className={styles.nomineeName}>{nominee.name}</p>
            </button>
          </div>
        ))}
      </div>
      <div className={styles.send}>
        <Button onClick={sendNominee}>Send Nominee</Button>
        <p>{msg}</p>
      </div>
    </div>
  );
};

export default NomineesCard;