import Image from "next/image"

export default function About() {
    return (
        <main className="p-6 space-y-8 xl:space-y-16">
            <section className="space-y-4 lg:space-y-8">
                <h1 className="text-[#1F92CE] font-extrabold text-3xl lg:text-4xl 2xl:text-5xl tracking-wider">Our Story</h1>
                <p className="italic text-sm lg:text-base 2xl:text-lg">One day, over a pizza night with friends, we wanted to split our expenses, and realized there is no easy way to do it with cryptocurrency. So we built this app—to make sharing costs with friends simple and straightforward, every time. Enjoy!</p>
            </section>
            <section className="space-y-8 lg:flex lg:flex-row lg:gap-8 lg:space-y-0 lg:justify-between">
                <section className="space-y-4 lg:space-y-8 lg:flex-1">
                    <h1 className="text-[#1F92CE] font-extrabold text-3xl lg:text-4xl 2xl:text-5xl tracking-wider">How it works</h1>
                    <ul className="space-y-4 lg:space-y-6">
                        <li className="flex flex-row gap-8 lg:gap-12 justify-start items-center">
                            <div className="max-w-[3rem]">
                                <Image src="/group.svg" width={128} height={128} alt=" group" />
                            </div>
                            <aside className="w-[80%]">
                                <h2 className="font-semibold lg:text-lg 2xl:text-xl">1. Open a Group</h2>
                                <p className="text-sm lg:text-base 2xl:text-lg">Choose a descriptive name and owner name and select the currency.</p>
                            </aside>
                        </li>
                        <li className="flex flex-row gap-8 lg:gap-12 justify-start items-center">
                            <div className="max-w-[3rem]">
                                <Image src="/share.svg" width={128} height={128} alt="share" />
                            </div>
                            <aside className="w-[80%]">
                                <h2 className="font-semibold lg:text-lg 2xl:text-xl">2. Invite your friends </h2>
                                <p className="text-sm lg:text-base 2xl:text-lg">Share the group link with your friends.</p>
                            </aside>
                        </li>
                        <li className="flex flex-row gap-8 lg:gap-12 justify-start items-center">
                            <div className="max-w-[3rem]">
                                <Image src="/collected.svg" width={128} height={128} alt="money" />
                            </div>
                            <aside className="w-[80%]">
                                <h2 className="font-semibold lg:text-lg 2xl:text-xl">3. Withdraw funds</h2>
                                <p className="text-sm lg:text-base 2xl:text-lg">Click “Withdraw Now” once you are ready. Only the group creator (owner) can withdraw the funds. After that, users won&apos;t be able to deposit to group.</p>
                            </aside>
                        </li>
                    </ul>
                </section>
                <section className="space-y-4 lg:space-y-8 lg:flex-1">
                    <h1 className="text-[#1F92CE] font-extrabold text-3xl lg:text-4xl 2xl:text-5xl tracking-wider">Technical details</h1>
                    <ul className="list-disc px-6 text-sm lg:text-base 2xl:text-lg lg:space-y-1">
                        <li>Currently support USDC and ETH on Base.</li>
                        <li>The app is completely backendless.</li>
                        <li>Contract and website code is open source.</li>
                        <li>We don&apos;t charge any fees beyond gas.</li>
                        <li>You can try it out also in Base Sepolia.</li>
                        <li>Contact us for feedback or questions.</li>
                    </ul>
                </section>
            </section>
        </main>
    )
}