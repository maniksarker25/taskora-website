import Image from 'next/image'
import React from 'react'
import servifyimg from '../../../public/Badges.svg'
import servifyimg1 from '../../../public/Badges (1).svg'
import hand_mobile from '../../../public/mobile_wiht_hand.svg'
import Link from 'next/link'

const Servify = () => {
  return (
    <section className='bg-[#E6F4F1] pt-20 pb-20'>
        <div className='max-w-[1240px] mx-auto px-4 flex justify-between items-center gap-10 flex-col md:flex-row'>
            {/* left side */}
            <div className='flex flex-col gap-6'>
                <h3 className='text-3xl font-semibold md:leading-normal'>Join <span className='text-[#115E59]'>Taskalley</span> & Simplify Your Service Experience Today!</h3>
                <p className='text-[#6B7280] md:text-xl'>Find trusted professionals or grow your business by offering services online — all in one seamless platform. Accessible anytime from your desktop or mobile browser.</p>
                <div className='flex  gap-8 mt-5'>
                    <Link href=''><Image src={servifyimg} alt='servifyimg'/></Link>
                    <Link href=''><Image src={servifyimg1} alt='servifyimg1'/></Link>
                </div>
            </div>
            {/* right side */}
            <div>
                <Image src={hand_mobile} alt='Hand holding mobile phone' height={1200} className='object-cover'/>
            </div>
        </div>
    </section>
  )
}

export default Servify