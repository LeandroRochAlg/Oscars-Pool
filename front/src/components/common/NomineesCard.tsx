import { useState } from "react";
import styles from "./NomineesCard.module.css";
import { Category } from "../../types/Category";
import Button from "./Button";
import { Nominee } from "../../types/Nominee";

interface NomineesCardProps {
  category: Category;
  onClick: (selectedNominee: any) => void;
  showBtn: boolean;
  msg?: string;
}

const NomineesCard = (CardProps: NomineesCardProps) => {
  const [selectedNominee, setSelectedNominee] = useState<number | null>(null);
  const { category, onClick, showBtn, msg } = CardProps;

  const sendNominee = () => {
    onClick(selectedNominee);
    setSelectedNominee(null);
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.category}>{category.category}<span>{category.value}</span></h3>
      <div className={styles.nominees}>
        {category.nominees.map((nominee: Nominee) => (
          <div key={nominee.id} className={styles.nominee}>
            <button
              onClick={() => setSelectedNominee(nominee.id)}
              className={`${styles.nomineeButton} ${selectedNominee === nominee.id ? styles.selected : ""} ${nominee.userBet ? styles.userBet : ""} ${category.winner === nominee.id ? styles.winner : ""}`}
            >
              <p className={styles.nomineeMovie}>{nominee.movieTitle}</p>
              <p className={styles.nomineeName}>{nominee.name}</p>
            </button>
          </div>
        ))}
      </div>
      <div className={styles.send}>
        {showBtn && <Button onClick={sendNominee}>Send Nominee</Button>}  {/* Shows the button if the showBtn prop is true */}
        <p>{msg}</p>
      </div>
    </div>
  );
};

export default NomineesCard;