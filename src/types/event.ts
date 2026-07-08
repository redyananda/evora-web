export interface Event {
    id: number;
    eventName: string;
    description: string;
    category: string;
    price: number;
    venue: string;
    location: string;
    startDate: string;
    endDate: string;
    totalSeats: number;
    availableSeats: number;
    organizerId: number;
    thumbnail: string;
    createdAt: string;
    updatedAt: string;
    organizer: {
        organizerName: string;
    }
}




// {
//             "id": 16,
//             "eventName": "Sunrise Yoga & Breathwork Festival",
//             "description": "Festival kesehatan di tepi pantai yang menggabungkan yoga, teknik pernapasan, dan meditasi kolektif saat matahari terbit. Dipandu instruktur bersertifikat internasional, acara ini menawarkan pengalaman menyegarkan bagi pemula maupun praktisi berpengalaman. Akhiri sesi dengan sarapan sehat dan komunitas yang penuh energi positif.",
//             "category": "WELLNESS",
//             "price": 275000,
//             "venue": "Pantai Pandawa",
//             "location": "Bali",
//             "startDate": "2026-09-14T05:30:00.000Z",
//             "endDate": "2026-09-14T11:00:00.000Z",
//             "totalSeats": 500,
//             "availableSeats": 500,
//             "organizerId": 2,
//             "thumbnail": "https://backendlessappcontent.com/84619254-D580-4979-B385-4B75DA23181F/88DAD701-4EBF-40CE-9B2F-1E6F66575F6A/files/evora/thumbnail/sunrise_yoga.webp",
//             "createdAt": "2026-07-07T11:09:11.464Z",
//             "updatedAt": "2026-07-07T11:09:11.464Z",
//             "organizer": {
//                 "organizerName": "Seoul Sonic"
//             }
//         },