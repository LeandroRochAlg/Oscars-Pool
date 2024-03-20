### Document of Requirements for 2025 Oscar Pool Enhancements

#### Introduction
The Oscar Winners' Pool platform is undergoing a series of enhancements to improve flexibility, engagement, and user experience for the 2025 awards season. This document outlines the requirements for implementing these enhancements.

#### System Requirements
1. **Multiple Prediction Pools**
   - Users must be able to create their own prediction pools.
   - Each pool can have its own set of categories and weights.
   - Support for both private pools (invite-only) and public pools (open to all users).

2. **Customizable Categories and Weights**
   - Pool creators can select which categories to include in their pool from the list of Oscar categories.
   - Creators can assign weights to each category or opt for weights to be determined through player voting.
   - If voting is enabled, each player must allocate a total of 100 points across all categories. The system calculates the average to determine final weights.

3. **Ranked Betting System**
   - Users must rank nominees within each category from most likely to win to least likely.
   - A tiered points system awards points based on the accuracy of these rankings.
   - Points distribution varies based on the number of nominees in a category.

4. **Design Overhaul**
   - The user interface must be redesigned to accommodate new features and improve overall aesthetics.
   - The design must be responsive, ensuring compatibility across devices.

5. **Discord Integration (Optional)**
   - Investigate the feasibility of integrating with Discord for creating server-specific pools.
   - Allow users to link their Discord accounts for easy access and pool management.

#### Functional Requirements
- A flexible pool creation tool that allows for easy customization of categories and weights.
- A betting interface that supports ranking nominees and displays potential points based on current selections.
- A system for calculating and displaying pool standings, including adjustments based on final category weights.
- Security measures to protect user information and ensure fair play within pools.

#### Non-functional Requirements
- Scalability to support a potentially large number of concurrent pools and users.
- High availability, especially during peak times leading up to and during the Oscar awards ceremony.
- An intuitive and visually appealing user interface to enhance user satisfaction and retention.

This document serves as a foundation for the development of the enhanced Oscar Winners' Pool platform. The requirements will be refined through user feedback and technical feasibility studies as the project progresses.