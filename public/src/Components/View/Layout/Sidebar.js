// import React from "react";
// import Carousel from "react-multi-carousel";
// import "react-multi-carousel/lib/styles.css";
// import { NavLink } from "react-router-dom";

// const responsive = {
//   superLargeDesktop: {
//     // the naming can be any, depends on you.
//     breakpoint: { max: 4000, min: 3000 },
//     items: 5,
//   },
//   desktop: {
//     breakpoint: { max: 3000, min: 1024 },
//     items: 5,
//   },
//   tablet: {
//     breakpoint: { max: 1024, min: 464 },
//     items: 3,
//   },
//   mobile: {
//     breakpoint: { max: 464, min: 0 },
//     items: 3,
//   },
// };
// export default function Sidebar() {

//   let activePath = window.location.pathname;

//   const renderMobileSidebar = () => {
//     let divEle = document.getElementsByClassName("sidebar-banner")[0];
//     divEle.classList.toggle("sidebar-display");
//   };
//   return (
//     <div className="relative">
  
//       <div>
//         <div className="sidebar-banner">
//           <div className="toogle-menu pt-8 cursor-pointer menu-box flex justify-center items-center toogle-img">
//             <img src={require("../../../assets/img/ListIcon.png").default} />
//           </div>
//           <div className="">
//             <div className="sidebar-height-full">
//               <div>
//                 <div className="flex items-center">
//                   <NavLink exact to="/" className={`${activePath === "/" ? "sidebar-box" : "sidebar-box-one"} flex items-center justify-center cursor-pointer`}>
//                     <div className={`${activePath === "/" ? "sidebar-box" : "sidebar-box-one"} flex icon-svg-toogle items-center justify-center cursor-pointer`}>
//                       {/* <img
//                         src={require("../../../assets/img/sidebar-menu.svg").default}
//                         alt="bag" 
//                       /> */}
//                       {activePath === "/" ? <div className="sidebar-toggle-icon dashboard-icon-size">
//                         <img
//                           src={require("../../../assets/img/sidebar-toogle4.svg").default}
//                           alt="Staff"
//                         />
//                       </div> : <div className="sidebar-show-icon">
//                         <img
//                           src={require("../../../assets/img/sidebar-menu.svg").default}
//                           alt="Staff"
//                         />
//                       </div>}


//                     </div>
//                   </NavLink>
//                   <div className="text-none-sidebar">
//                     <NavLink to="/">
//                       <span className="font-size-25 white-text-color pl-3 font-medium tracking-normal">
//                         Dashboard
//                       </span>
//                     </NavLink>
//                   </div>
//                 </div>
//                 <div className="flex items-center pt-5">
//                   <NavLink exact to="/calender" className={`${activePath === "/calender" ? "sidebar-box" : "sidebar-box-one"} flex items-center justify-center cursor-pointer`}>
//                     <div className={`${activePath === "/calender" ? "sidebar-box" : "sidebar-box-one"} flex icon-svg-toogle items-center justify-center cursor-pointer`}>
//                       {/* <div className="sidebar-box-one flex items-center justify-center cursor-pointer"> */}
//                       {/* <img
//                         src={require("../../../assets/img/sidebar-sec.svg").default}
//                         alt="bag" 
//                       /> */}
//                       {activePath === "/calender" ? <div className="sidebar-toggle-icon">
//                         <img
//                           src={require("../../../assets/img/sidebar-toogle2.svg").default}
//                           alt="Staff"
//                         />
//                       </div> : <div className="sidebar-show-icon">
//                         <img
//                           src={require("../../../assets/img/sidebar-sec.svg").default}
//                           alt="Staff"
//                         />
//                       </div>}


//                     </div>
//                   </NavLink>

//                   <div className="text-none-sidebar">
//                     <NavLink to="/calender">
//                       <span className="font-size-25 white-text-color pl-3 font-medium tracking-normal">
//                         Calendar
//                       </span>
//                     </NavLink>
//                   </div>
//                 </div>
//                 <div className="flex items-center pt-5">
//                   <NavLink exact to="/customer" className={`${activePath === "/customer" ? "sidebar-box" : "sidebar-box-one"} flex items-center justify-center cursor-pointer`}>
//                     <div className={`${activePath === "/customer" ? "sidebar-box" : "sidebar-box-one"} flex icon-svg-toogle items-center justify-center cursor-pointer`}>
//                       {/* <img
//                         src={require("../../../assets/img/sidebar-three.svg").default}
//                         alt="bag" 
//                       /> */}
//                       {activePath === "/customer" ? <div className="sidebar-toggle-icon">
//                         <img
//                           src={require("../../../assets/img/sidebar-toogle3.svg").default}
//                           alt="Staff"
//                         />
//                       </div> : <div className="sidebar-show-icon">
//                         <img
//                           src={require("../../../assets/img/sidebar-three.svg").default}
//                           alt="Staff"
//                         />
//                       </div>}


//                     </div>
//                   </NavLink>
//                   <div className="text-none-sidebar">
//                     <NavLink to="/customer">
//                       <span className="font-size-25 white-text-color pl-3 font-medium tracking-normal">
//                         Customer
//                       </span>
//                     </NavLink>
//                   </div>
//                 </div>

//                 <div className="flex items-center pt-5">
//                   <NavLink exact to="/staff" className={`${activePath === "/staff" ? "sidebar-box" : "sidebar-box-one"} flex items-center justify-center cursor-pointer`}>
//                     <div className={`${activePath === "/staff" ? "sidebar-box" : "sidebar-box-one"} flex icon-svg-toogle items-center justify-center cursor-pointer`}>
//                       {activePath === "/staff" ? <div className="sidebar-toggle-icon">
//                         <img
//                           src={require("../../../assets/img/sidebar-toogle1.svg").default}
//                           alt="Staff"
//                         />
//                       </div> :
//                         <div className="sidebar-show-icon">
//                           <img
//                             src={require("../../../assets/img/sidebar-four.svg").default}
//                             alt="Staff"
//                           />
//                         </div>
//                       }
//                     </div>
//                   </NavLink>
//                   <div className="text-none-sidebar">
//                     <NavLink to="/staff">
//                       <span className="font-size-25 white-text-color pl-3 font-medium tracking-normal">
//                         Staff
//                       </span>
//                     </NavLink>
//                   </div>
//                 </div>

//                 <div className="flex items-center pt-5">
//                   <NavLink exact to="/service" className={`${activePath === "/service" ? "sidebar-box" : "sidebar-box-one"} flex items-center justify-center cursor-pointer`}>
//                     <div className={`${activePath === "/service" ? "sidebar-box" : "sidebar-box-one"} flex icon-svg-toogle items-center justify-center cursor-pointer`}>
//                       {activePath === "/service" ? <div className="sidebar-toggle-icon">
//                         <img
//                           src={require("../../../assets/img/sidebar-toogle.svg").default}
//                           alt="bag"
//                         />
//                       </div> :
//                         <div className="sidebar-show-icon">
//                           <img
//                             src={require("../../../assets/img/sidebar-five.svg").default}
//                             alt="bag"
//                           />
//                         </div>
//                       }
//                     </div>
//                   </NavLink>
//                   <div className="text-none-sidebar">
//                     <NavLink to="/service">
//                       <span className="font-size-25 white-text-color pl-3 font-medium tracking-normal">
//                         Services
//                       </span>
//                     </NavLink>
//                   </div>
//                 </div>
//                  <div className="flex items-center pt-5">
//                   <NavLink exact to="/inventory" className={`${activePath === "/inventory" ? "sidebar-box" : "sidebar-box-one"} flex items-center justify-center cursor-pointer`}>
//                     <div className={`${activePath === "/inventory" ? "sidebar-box" : "sidebar-box-one"} flex items-center image-align justify-center cursor-pointer`}>
                   
//                     {activePath === "/inventory" ?   <div className="sidebar-toggle-icon">
//                         <img
//                             src={require("../../../assets/img/inventory.png").default}
//                             alt="bag" 
//                           />
//                       </div>:
//                     <div className="sidebar-show-icon image-align">
//                       <img
//                           src={require("../../../assets/img/white-inv.png").default}
//                           alt="bag" 
//                         />
//                       </div>
// }
//                     </div>
//                   </NavLink> 
//                 <div className="text-none-sidebar">
//                     <NavLink to="/inventory">
//                       <span className="font-size-25 white-text-color pl-3 font-medium tracking-normal">
//                         Inventory
//                       </span>
//                     </NavLink>
//                   </div> 
//                  </div> 
//               <div className="flex items-center pt-5">
//                   <NavLink exact to="/invoice" className={`${activePath === "/invoice" ? "sidebar-box" : "sidebar-box-one"} flex items-center justify-center cursor-pointer`}>
//                     <div className={`${activePath === "/invoice" ? "sidebar-box" : "sidebar-box-one"} flex items-center image-align justify-center cursor-pointer`}>
                   
//                     {activePath === "/invoice" ?   <div className="sidebar-toggle-icon">
//                         <img
//                             src={require("../../../assets/img/inventory.png").default}
//                             alt="bag" 
//                           />
//                       </div>:
//                     <div className="sidebar-show-icon image-align">
//                       <img
//                           src={require("../../../assets/img/white-inv.png").default}
//                           alt="bag" 
//                         />
//                       </div>
// }
//                     </div>
//                   </NavLink> 
//                 <div className="text-none-sidebar">
//                     <NavLink to="/invoice">
//                       <span className="font-size-25 white-text-color pl-3 font-medium tracking-normal">
//                        Invoice
//                       </span>
//                     </NavLink>
//                   </div> 
//               </div>  
//                 {/* <div className="">
//                   <div className="barbera-web">
//                     <div className="text-none-sidebar">
//                       <p className="font-size-18 white-text-color font-normal tracking-normal">
//                         Powered by <br /><sapn className="font-medium">barbera.io</sapn>
//                       </p>
//                     </div>
//                   </div>
//                 </div> */}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
