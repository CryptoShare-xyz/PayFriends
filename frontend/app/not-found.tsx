import Link from 'next/link';

export default function NotFound() {
    return (
        <div className='h-screen flex flex-col items-center justify-center'>
            <h2 className='text-muted-foreground my-2 text-lg md:text-3xl'>Page not found</h2>
            <Link className=" rounded-xl p-2 w-fit bg-gradient-to-br from-[#009BEB] to-[#005885] text-slate-100 text-sm md:text-lg text-center" href="/">
                Return Home
            </Link>
        </div>
    )
}