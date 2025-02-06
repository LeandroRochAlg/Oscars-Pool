import path from 'path';
import fs from 'fs';

class NomineeService {
    async getNominees() {
        const nomineesPath = path.join('src', 'data', 'nominees.json');
        const nomineesData = fs.readFileSync(nomineesPath);
        const nominees = JSON.parse(nomineesData.toString());

        return nominees;
    }
}

export default new NomineeService();