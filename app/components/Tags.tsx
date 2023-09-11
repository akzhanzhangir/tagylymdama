export default function Tags(props: { items: string[] }) {
    return (
        <div className='hidden flex-wrap justify-end gap-2 text-right md:flex'>
            {props.items.map((tag, index) => (
                <p className='text-xs' key={index}>
                    #{tag}
                </p>
            ))}
        </div>
    );
}
