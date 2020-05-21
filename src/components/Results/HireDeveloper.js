import React from 'react';
import ownerProfile from '../../assets/images/owner-profile.png';
import userProfile from '../../assets/images/user-profile-img.png';
import logo from '../../assets/images/logo.svg';
import cardIcon from '../../assets/images/card-i-icon.png';

export default class HireDeveloper extends React.Component {
    render() {
        return (
            <>
                <div className="p-content-box">
                    <div className="p-message">
                        <div className="p-m-text">
                            <h2>Hey there, I'm Andrew!</h2>
                            <p>
                                I’m the proud owner and CEO of Ecom Experts. I built Test My Store Speed because I felt the Shopify community needed a tool with specific - clear recommendations for Shopify. Our goal is to make it easy for anyone to see how their store performs and learn what they can do about it. Of course, some of the elements still require help from a pro but at least you’ll get a better overview of your situation.
                            </p>
                            <p>
                             
                                I’ve also curated a list of the best Shopify developers I know, who will be able to help you speed up your store speed.
                            </p>
                        </div>
                        <div className="p-m-img">
                            <img src={ownerProfile} alt="" />
                        </div>
                    </div>

                    <ul className="p-buttons">
                        <li><button className="blue-colored" onClick={()=> window.open("https://www.ecomexperts.io/pages/contact", "_blank")}>Let's work together</button></li>
                        <li><button onClick={()=> window.open("https://www.ecomexperts.io", "_blank")}>More about us</button></li>
                    </ul>
                </div>

                <div className="p-hd-cards-box">
                    <h2 className="p-small-heading">Developers</h2>
                    <div className="p-hd-cards-content">
                        <div className="p-content-box">
                            <div className="p-card-icon-detail">
                                <div className="p-card-icon"><img src={userProfile} alt="" /></div>
                                <h2>Lukas</h2>
                                <p className="designation">Developer</p>
                            </div>

                            <p>
                                Hey! I'm Lukas. I built the tol you're using right now. Hire me to fix your site for $125/hr.
                            </p>

                            <ul className="p-buttons">
                                <li><button>Let's work together</button></li>
                            </ul>
                        </div>

                        <div className="p-content-box">
                            <div className="p-card-icon-detail">
                                <div className="p-card-icon"><img src={logo} alt="" /></div>
                                <h2>Ecom Experts</h2>
                                <p className="designation">Agency</p>
                            </div>

                            <p>
                                Ecom Experts specializes in speedopimizations for Shopify websites. Full optimizations with a guarantee load time under 5s start at $699.
                            </p>

                            <ul className="p-buttons">
                                <li><button onClick={()=> window.open("https://www.ecomexperts.io/pages/contact", "_blank")}>Let's work together</button></li>
                            </ul>
                        </div>

                        <div className="p-content-box have-border">
                            <div className="p-card-icon-detail">
                                <div className="p-card-icon"><img src={cardIcon} alt="" /></div>
                                <h2>Are you a Shopify Developer or Agency?</h2>
                            </div>

                            <p>
                                Click below and request to be added to this developer directory. Getting listed is free.
                            </p>

                            <ul className="p-buttons">
                                <li><button onClick={()=> window.open("https://www.ecomexperts.io/pages/contact", "_blank")}>Get listed</button></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
