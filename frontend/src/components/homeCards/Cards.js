import React from "react"
import 'animate.css'

function Cards() {
    return(
        <div>
                <div className="container mediumBackground c bottomPadding20">
                    <div className="box hoverEnlarge c animate__fadeIn animate__animated">
                        <img src="images/math.svg" alt="Image 1" className="box__img c" />
                        <h3 className="box__text c">Math</h3>
                    </div>
                    <div class="box hoverEnlarge c animate__fadeIn animate__animated">
                        <img src="images/music.svg" alt="Image 2" className="box__img c" />
                        <h3 className="box__text c">Music</h3>
                    </div>
                    <div class="box hoverEnlarge c animate__fadeIn animate__animated">
                        <img src="images/art.svg" alt="Image 3" className="box__img c" />
                        <h3 className="box__text c">Art</h3>
                    </div>
                    <div class="box hoverEnlarge c animate__fadeIn animate__animated">
                        <img src="images/cooking.svg" alt="Image 4" className="box__img c" />
                        <h3 className="box__text c">Cooking</h3>
                    </div>
                    <div class="box hoverEnlarge c animate__fadeIn animate__animated">
                        <img src="images/programming.svg" alt="Image 5" className="box__img c" />
                        <h3 className="box__text c">Programming</h3>
                    </div>
                </div>
                <div className='darkBackground c'><img src='images/bottomBackground.svg' className='bottomBackground c'/></div>
                <div className='darkBackground c'>
                    <div className='cards c'>
                        <ul className='cards__items c'>
                            <li className='card__item blackBackground c'>
                                <div className='cards__item__info c'>
                                    <h1 className='statistic noMargin c '>50K+</h1>
                                    <h3 className='statistic noMargin white c'>TRADERS</h3>
                                </div>
                            </li>

                            <li className='card__item blackBackground c'>
                                <div className='cards__item__info c'>
                                    <h1 className='statistic noMargin c'>30</h1>
                                    <h3 className='statistic noMargin white c'>AFFLILATED UNIVERSITIES</h3>
                                </div>
                            </li>

                            <li className='card__item blackBackground c'>
                                <div className='cards__item__info c'>
                                    <h1 className='statistic noMargin c'>9/10</h1>
                                    <h3 className='statistic noMargin white c'>BY IGN</h3>
                                </div>
                            </li>
                        </ul>
                   </div>
            </div>
        </div>
        
    )
}

export default Cards