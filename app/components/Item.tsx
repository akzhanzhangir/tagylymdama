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
                    ? 'bg-gray-100 hover:bg-blue-500 dark:bg-gray-700'
                    : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:bg-blue-500',
                'my-2 mx-5 rounded-xl p-1  transition-all duration-500 hover:text-blue-500 sm:mx-0'
            )}
        >
            <Link href={job.Link}>
                <div className='flex flex-wrap rounded-xl bg-white p-2  dark:bg-black '>
                    <div className='w-full p-2 text-2xl font-bold  sm:w-1/2 sm:text-3xl'>
                        {job.Name}
                    </div>
                    <div className='w-0 p-0 sm:w-1/2 sm:p-2'>
                        <Tags items={job.Tags} />
                    </div>
                    <div className='flex w-1/2 items-center gap-2 p-2  text-sm sm:text-base '>
                        <LocationIcon />{' '}
                        <span className='truncate'>{job.Location}</span>
                        {job.Paid ? <DollarIcon /> : <></>}
                    </div>
                    <div className='w-1/2 p-2 text-right  text-sm sm:text-base'>
                        {job.Deadline}
                    </div>
                </div>
            </Link>
        </div>
    );
}
