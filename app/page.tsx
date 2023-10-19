import { Job } from '@/lib/types';
import { dateParse, isPastDeadline } from '@/lib/utils';
import Link from 'next/link';
import { DollarIcon } from './components/Icons';
import Item from './components/Item';
import { Extractor } from '@/lib/MD2Table';

async function getData() {
    const res = await fetch(
        'https://raw.githubusercontent.com/danabeknar/kazakhstan-it-internships/main/README.md',
        {
            next: {
                revalidate: 86400,
            },
        }
    );

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data');
    }

    const rawMarkdown = Extractor.extractTable(
        await res.text(),
        'rows',
        false
    ).slice(1);

    const jobs: Job[] = rawMarkdown.map((val: string[]) => {
        let job: Job = {
            Name: val[0],
            Internship: val[1].match(/\>(.*?)\</)![1],
            Location: val[2] == '?' ? 'No Location' : val[2],
            Paid: val[3] == '+' ? true : false,
            Tags: val[4]
                .split(',')
                .filter((val: string | any[]) => val.length < 10)
                .map((val: string) => val.replace(/[\])}[{(]/g, '').trim())
                .splice(0, 5),
            Deadline:
                dateParse(val[5]).toString() === 'Invalid Date'
                    ? 'no date :/'
                    : dateParse(val[5]).toLocaleDateString('de-DE'),
            DeadlinePassed: isPastDeadline(dateParse(val[5])),
            Link: val[1].split('"')[1],
        };
        return job;
    });

    return jobs;
}

export default async function Home() {
    const data = await getData();

    return (
        <main>
            <div className='mx-auto max-w-2xl'>
                <div className='flex flex-col p-4 sm:p-4'>
                    <h1 className='px-4 py-2 text-3xl font-bold tracking-tight dark:text-white md:text-6xl'>
                        Kazakhstan
                        <br />
                        IT Internships
                    </h1>
                    <div className='px-5 text-sm tracking-tight dark:text-white md:text-xl'>
                        <p>
                            Source:{' '}
                            <a
                                className='text-blue-500'
                                href='https://github.com/danabeknar/kazakhstan-it-internships'
                            >
                                this repo.
                            </a>
                        </p>
                        <p>Made using next.js ISR.</p>
                        <p>
                            <span className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent'>
                                HIGHLIGHTED
                            </span>{' '}
                            items aren&apos;t past the deadline.
                        </p>
                        <p className='flex flex-row items-center gap-2 mb-4'>
                            Dollar icon <DollarIcon /> means it is paid.
                        </p>
                    </div>
                </div>
                <div className='flex cursor-pointer flex-col dark:text-white'>
                    {data.map((value, id) => {
                        return <Item job={value} key={id} />;
                    })}
                    <footer className='m-6 text-black dark:text-white'>
                        <Link href='https://github.com/djakish'>
                            my github.
                        </Link>
                    </footer>
                </div>
            </div>
        </main>
    );
}
