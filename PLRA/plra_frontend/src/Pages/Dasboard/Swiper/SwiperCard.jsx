import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css/pagination';
import 'swiper/css';
import '../../Styles.css'


const SwiperCard = () => {
    return (
        <div>
            <Swiper
                pagination={true}
                modules={[Pagination, Autoplay]}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
            >
                <SwiperSlide style={{ height: '280px' }}>
                    <p className='swiper-text'>You have received <span style={{ color: "#379237" }}>12</span> new approvals in the last month.</p>
                </SwiperSlide>
                <SwiperSlide style={{ height: '280px' }}>
                    <p className='swiper-text'>Your team completed <span style={{ color: "#379237" }}>8</span> projects this week.</p>
                </SwiperSlide>
                <SwiperSlide style={{ height: '280px' }}>
                    <p className='swiper-text'>You have <span style={{ color: "#379237" }}>5</span> pending tasks due today.</p>
                </SwiperSlide>
                <SwiperSlide style={{ height: '280px' }}>
                    <p className='swiper-text'>Your sales increased by <span style={{ color: "#379237" }}>20%</span> in the last quarter.</p>
                </SwiperSlide>

            </Swiper>
        </div>
    )
}

export default SwiperCard