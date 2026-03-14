import { EditionCategory } from '../models/edition';
import { Nominee } from '../models/nominee';

const OSCAR_2026_PLACEHOLDER = '/nominees/oscar_2026_placeholder.svg';

const nominee = (name: string, detail: string): Nominee => ({
    name,
    detail,
    movieImage: OSCAR_2026_PLACEHOLDER,
});

export const OSCAR_2026_CATEGORIES: EditionCategory[] = [
    {
        category: 'nominees.category.actor',
        nominees: [
            nominee('Timothée Chalamet', 'Marty Supreme'),
            nominee('Leonardo DiCaprio', 'One Battle After Another'),
            nominee('Ethan Hawke', 'Blue Moon'),
            nominee('Michael B. Jordan', 'Sinners'),
            nominee('Wagner Moura', 'The Secret Agent'),
        ],
        winner: null,
    },
    {
        category: 'nominees.category.supportingActor',
        nominees: [
            nominee('Benicio del Toro', 'One Battle After Another'),
            nominee('Jacob Elordi', 'Frankenstein'),
            nominee('Delroy Lindo', 'Sinners'),
            nominee('Sean Penn', 'One Battle After Another'),
            nominee('Stellan Skarsgård', 'Sentimental Value'),
        ],
        winner: null,
    },
    {
        category: 'nominees.category.actress',
        nominees: [
            nominee('Jessie Buckley', 'Hamnet'),
            nominee('Rose Byrne', "If I Had Legs I'd Kick You"),
            nominee('Kate Hudson', 'Song Sung Blue'),
            nominee('Renate Reinsve', 'Sentimental Value'),
            nominee('Emma Stone', 'Bugonia'),
        ],
        winner: null,
    },
    {
        category: 'nominees.category.supportingActress',
        nominees: [
            nominee('Elle Fanning', 'Sentimental Value'),
            nominee('Inga Ibsdotter Lilleaas', 'Sentimental Value'),
            nominee('Amy Madigan', 'Weapons'),
            nominee('Wunmi Mosaku', 'Sinners'),
            nominee('Teyana Taylor', 'One Battle After Another'),
        ],
        winner: null,
    },
    {
        category: 'nominees.category.animatedFeature',
        nominees: [
            nominee('Arco', 'Ugo Bienvenu, Félix de Givry, Sophie Mas, Natalie Portman'),
            nominee('Elio', 'Madeline Sharafian, Domee Shi, Adrian Molina, Mary Alice Drumm'),
            nominee('KPop Demon Hunters', 'Maggie Kang, Chris Appelhans, Michelle L. M. Wong'),
            nominee('Little Amélie or the Character of Rain', 'Maïlys Vallade, Liane-Cho Han, Nidia Santiago, Henri Magalon'),
            nominee('Zootopia 2', 'Jared Bush, Byron Howard, Yvett Merino'),
        ],
        winner: null,
    },
    {
        category: 'nominees.category.animatedShort',
        nominees: [
            nominee('Butterfly', 'Florence Miailhe, Ron Dyens'),
            nominee('Forevergreen', 'Nathan Engelhardt, Jeremy Spears'),
            nominee('The Girl Who Cried Pearls', 'Chris Lavis, Maciek Szczerbowski'),
            nominee('Retirement Plan', 'John Kelly, Andrew Freedman'),
            nominee('The Three Sisters', 'Konstantin Bronzit'),
        ],
        winner: null,
    },
    {
        category: 'nominees.category.cinematography',
        nominees: [
            nominee('Frankenstein', 'Dan Laustsen'),
            nominee('Marty Supreme', 'Darius Khondji'),
            nominee('One Battle After Another', 'Michael Bauman'),
            nominee('Sinners', 'Autumn Durald Arkapaw'),
            nominee('Train Dreams', 'Adolpho Veloso'),
        ],
        winner: null,
    },
    {
        category: 'nominees.category.costumeDesign',
        nominees: [
            nominee('Avatar: Fire and Ash', 'Deborah L. Scott'),
            nominee('Frankenstein', 'Kate Hawley'),
            nominee('Hamnet', 'Malgosia Turzanska'),
            nominee('Marty Supreme', 'Miyako Bellizzi'),
            nominee('Sinners', 'Ruth E. Carter'),
        ],
        winner: null,
    },
    {
        category: 'nominees.category.directing',
        nominees: [
            nominee('Hamnet', 'Chloé Zhao'),
            nominee('Marty Supreme', 'Josh Safdie'),
            nominee('One Battle After Another', 'Paul Thomas Anderson'),
            nominee('Sentimental Value', 'Joachim Trier'),
            nominee('Sinners', 'Ryan Coogler'),
        ],
        winner: null,
    },
    {
        category: 'nominees.category.documentaryFeature',
        nominees: [
            nominee('The Alabama Solution', 'Andrew Jarecki, Charlotte Kaufman'),
            nominee('Come See Me in the Good Light', 'Ryan White, Jessica Hargrave, Tig Notaro, Stef Willen'),
            nominee('Cutting Through Rocks', 'Sara Khaki, Mohammadreza Eyni'),
            nominee('Mr Nobody Against Putin', 'David Borenstein, Pavel Talankin, Helle Faber, Alžběta Karásková'),
            nominee('The Perfect Neighbor', 'Geeta Gandbhir, Alisa Payne, Nikon Kwantu, Sam Bisbee'),
        ],
        winner: null,
    },
    {
        category: 'nominees.category.documentaryShort',
        nominees: [
            nominee('All the Empty Rooms', 'Joshua Seftel, Conall Jones'),
            nominee('Armed Only with a Camera: The Life and Death of Brent Renaud', 'Craig Renaud, Juan Arredondo'),
            nominee('Children No More: "Were and Are Gone"', 'Hilla Medalia, Sheila Nevins'),
            nominee('The Devil Is Busy', 'Christalyn Hampton, Geeta Gandbhir'),
            nominee('Perfectly a Strangeness', 'Alison McAlpine'),
        ],
        winner: null,
    },
    {
        category: 'nominees.category.filmEditing',
        nominees: [
            nominee('F1', 'Stephen Mirrione'),
            nominee('Marty Supreme', 'Ronald Bronstein, Josh Safdie'),
            nominee('One Battle After Another', 'Andy Jurgensen'),
            nominee('Sentimental Value', 'Olivier Bugge Coutté'),
            nominee('Sinners', 'Michael P. Shawver'),
        ],
        winner: null,
    },
    {
        category: 'nominees.category.internationalFeature',
        nominees: [
            nominee('It Was Just an Accident', 'France'),
            nominee('The Secret Agent', 'Brazil'),
            nominee('Sentimental Value', 'Norway'),
            nominee('Sirāt', 'Spain'),
            nominee('The Voice of Hind Rajab', 'Tunisia'),
        ],
        winner: null,
    },
    {
        category: 'nominees.category.makeupAndHairstyling',
        nominees: [
            nominee('Frankenstein', 'Mike Hill, Jordan Samuel, Cliona Furey'),
            nominee('Kokuho', 'Kyoko Toyokawa, Naomi Hibino, Tadashi Nishimatsu'),
            nominee('Sinners', 'Ken Diaz, Mike Fontaine, Shunika Terry'),
            nominee('The Smashing Machine', 'Kazu Hiro, Glen Griffin, Bjoern Rehbein'),
            nominee('The Ugly Stepsister', 'Thomas Foldberg, Anne Cathrine Sauerberg'),
        ],
        winner: null,
    },
    {
        category: 'nominees.category.musicOriginalScore',
        nominees: [
            nominee('Bugonia', 'Jerskin Fendrix'),
            nominee('Frankenstein', 'Alexandre Desplat'),
            nominee('Hamnet', 'Max Richter'),
            nominee('One Battle After Another', 'Jonny Greenwood'),
            nominee('Sinners', 'Ludwig Göransson'),
        ],
        winner: null,
    },
    {
        category: 'nominees.category.musicOriginalSong',
        nominees: [
            nominee('Dear Me', 'Diane Warren: Relentless — Diane Warren'),
            nominee('Golden', 'KPop Demon Hunters — Ejae, Mark Sonnenblick, 24, Ido, Teddy Park'),
            nominee('I Lied to You', 'Sinners — Raphael Saadiq, Ludwig Göransson'),
            nominee('Sweet Dreams of Joy', 'Viva Verdi! — Nicholas Pike'),
            nominee('Train Dreams', 'Train Dreams — Nick Cave, Bryce Dessner'),
        ],
        winner: null,
    },
    {
        category: 'nominees.category.bestPicture',
        nominees: [
            nominee('Bugonia', 'Ed Guiney, Andrew Lowe, Yorgos Lanthimos, Emma Stone, Lars Knudsen'),
            nominee('F1', 'Chad Oman, Brad Pitt, Dede Gardner, Jeremy Kleiner, Joseph Kosinski, Jerry Bruckheimer'),
            nominee('Frankenstein', 'Guillermo del Toro, J. Miles Dale, Scott Stuber'),
            nominee('Hamnet', 'Liza Marshall, Pippa Harris, Nicolas Gonda, Steven Spielberg, Sam Mendes'),
            nominee('Marty Supreme', 'Eli Bush, Ronald Bronstein, Josh Safdie, Anthony Katagas, Timothée Chalamet'),
            nominee('One Battle After Another', 'Adam Somner, Sara Murphy, Paul Thomas Anderson'),
            nominee('The Secret Agent', 'Emilie Lesclaux'),
            nominee('Sentimental Value', 'Maria Ekerhovd, Andrea Berentsen Ottmar'),
            nominee('Sinners', 'Zinzi Coogler, Sev Ohanian, Ryan Coogler'),
            nominee('Train Dreams', 'Marissa McMahon, Teddy Schwarzman, Will Janowitz, Ashley Schlaifer, Michael Heimler'),
        ],
        winner: null,
    },
    {
        category: 'nominees.category.bestCast',
        nominees: [
            nominee('Hamnet', 'Nina Gold'),
            nominee('Marty Supreme', 'Jennifer Venditti'),
            nominee('One Battle after Another', 'Cassandra Kulukundis'),
            nominee('The Secret Agent', 'Gabriel Domingues'),
            nominee('Sinners', 'Francine Maisler'),
        ],
        winner: null,
    },
    {
        category: 'nominees.category.productionDesign',
        nominees: [
            nominee('Frankenstein', 'Tamara Deverell, Shane Vieau'),
            nominee('Hamnet', 'Fiona Crombie, Alice Felton'),
            nominee('Marty Supreme', 'Jack Fisk, Adam Willis'),
            nominee('One Battle After Another', 'Florencia Martin, Anthony Carlino'),
            nominee('Sinners', 'Hannah Beachler, Monique Champagne'),
        ],
        winner: null,
    },
    {
        category: 'nominees.category.liveActionShort',
        nominees: [
            nominee("Butcher's Stain", 'Meyer Levinson-Blount, Oron Caspi'),
            nominee('A Friend of Dorothy', 'Lee Knight, James Dean'),
            nominee("Jane Austen's Period Drama", 'Julia Aks, Steve Pinder'),
            nominee('The Singers', 'Sam A. Davis, Jack Piatt'),
            nominee('Two People Exchanging Saliva', 'Alexandre Singh, Natalie Musteata'),
        ],
        winner: null,
    },
    {
        category: 'nominees.category.sound',
        nominees: [
            nominee('F1', 'Gareth John, Al Nelson, Gwendolyn Yates Whittle, Gary A. Rizzo, Juan Peralta'),
            nominee('Frankenstein', 'Greg Chapman, Nathan Robitaille, Nelson Ferreira, Christian Cooke, Brad Zoern'),
            nominee('One Battle After Another', 'José Antonio García, Christopher Scarabosio, Tony Villaflor'),
            nominee('Sinners', 'Chris Welcker, Benjamin A. Burtt, Felipe Pacheco, Brandon Proctor, Steve Boeddeker'),
            nominee('Sirāt', 'Amanda Villavieja, Laia Casanovas, Yasmina Praderas'),
        ],
        winner: null,
    },
    {
        category: 'nominees.category.visualEffects',
        nominees: [
            nominee('Avatar: Fire and Ash', 'Joe Letteri, Richard Baneham, Eric Saindon, Daniel Barrett'),
            nominee('F1', 'Ryan Tudhope, Nicolas Chevallier, Robert Harrington, Keith Dawson'),
            nominee('Jurassic World Rebirth', 'David Vickery, Stephen Aplin, Charmaine Chan, Neil Corbould'),
            nominee('The Lost Bus', 'Charlie Noble, David Zaretti, Russell Bowen, Brandon K. McLaughlin'),
            nominee('Sinners', 'Michael Ralla, Espen Nordahl, Guido Wolter, Donnie Dean'),
        ],
        winner: null,
    },
    {
        category: 'nominees.category.writingAdaptedScreenplay',
        nominees: [
            nominee('Bugonia', 'Screenplay by Will Tracy'),
            nominee('Frankenstein', 'Written for the screen by Guillermo del Toro'),
            nominee('Hamnet', "Screenplay by Chloé Zhao & Maggie O'Farrell"),
            nominee('One Battle After Another', 'Written by Paul Thomas Anderson'),
            nominee('Train Dreams', 'Screenplay by Clint Bentley & Greg Kwedar'),
        ],
        winner: null,
    },
    {
        category: 'nominees.category.writingOriginalScreenplay',
        nominees: [
            nominee('Blue Moon', 'Written by Robert Kaplow'),
            nominee('It Was Just an Accident', 'Jafar Panahi with Nader Saïvar, Shadmehr Rastin, Mehdi Mahmoudian'),
            nominee('Marty Supreme', 'Written by Ronald Bronstein & Josh Safdie'),
            nominee('Sentimental Value', 'Written by Eskil Vogt and Joachim Trier'),
            nominee('Sinners', 'Written by Ryan Coogler'),
        ],
        winner: null,
    },
];
