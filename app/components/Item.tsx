import { Job } from '@/lib/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { LocationIcon, DollarIcon } from './Icons';
import Tags from './Tags';

export default function Item(props: { job: Job }) {
    const job = props.job;
    return (
        <div
            className={cn(
                job.DeadlinePassed
                    ? 'bg-gray-100 hover:bg-sky-400 dark:bg-gray-700'
                    : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:bg-sky-400',
                'my-2 mx-5 rounded-xl p-1 transition-color ease-in-out   duration-500 hover:text-sky-400 sm:mx-0'
            )}
        >
            <Link href={job.Link}>
                <div className='flex flex-wrap rounded-lg bg-white p-2 dark:bg-black '>
                    <div className='w-full sm:w-1/2 text-2xl sm:text-3xl p-2 font-bold'>
                        {job.Name}
                    </div>
                    <div className='w-0 p-0 sm:w-1/2 sm:p-2'>
                        <Tags items={job.Tags} />
                    </div>
                    <div className='flex w-full sm:w-1/2 items-center gap-2 p-2 text-sm sm:text-base '>
                        <LocationIcon />{' '}
                        <span className='truncate'>{job.Location}</span>
                        {job.Paid ? <DollarIcon /> : <></>}
                    </div>
                    <div className='w-1/2 p-2 sm:text-right text-sm sm:text-base'>
                        {job.Deadline}
                    </div>
                </div>
            </Link>
        </div>
    );
}
