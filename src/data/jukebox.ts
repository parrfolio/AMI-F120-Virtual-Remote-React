import { JukeboxData } from '@/types';

export const jukeboxData: JukeboxData = [
    {
        disc: [
            {
                songTitle: 'Killing Me Softly',
                side: 'A Side',
                artist: 'roberta flack',
                select: {
                    state: 'on',
                    selection: 1,
                    ptrains: [2, 1],
                    ptrainDelay: 400,
                },
            },
            {
                songTitle: 'Killing Me Softly Live',
                side: 'B Side',
                artist: 'roberta flack',
                select: {
                    state: 'on',
                    selection: 2,
                    ptrains: [2, 2],
                    ptrainDelay: 400,
                },
            },
        ],
    },
    {
        disc: [
            {
                songTitle: 'Now and Then',
                side: 'A Side',
                artist: 'Beatles',
                select: {
                    state: 'on',
                    selection: 1,
                    ptrains: [2, 1],
                    ptrainDelay: 400,
                },
            },
            {
                songTitle: 'Love Me Do',
                side: 'B Side',
                artist: 'Beatles',
                select: {
                    state: 'on',
                    selection: 2,
                    ptrains: [2, 2],
                    ptrainDelay: 400,
                },
            },
        ],
    },
    {
        disc: [
            {
                songTitle: 'Seven Nation Army',
                side: 'A Side',
                artist: 'The White Stripes',
                select: {
                    state: 'on',
                    selection: 1,
                    ptrains: [2, 1],
                    ptrainDelay: 400,
                },
            },
            {
                songTitle: 'Little Cream Soda Live',
                side: 'B Side',
                artist: 'The White Stripes',
                select: {
                    state: 'on',
                    selection: 2,
                    ptrains: [2, 2],
                    ptrainDelay: 400,
                },
            },
        ],
    },
];
