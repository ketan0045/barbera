import React from 'react'
import { NavLink } from 'react-router-dom';
import { get_Setting } from '../../../utils/user.util';
import '../Inventory/inventory.scss';
import { motion } from "framer-motion/dist/framer-motion";
export default function Products() {
    let SettingInfo = get_Setting()

    return (
        <div className="w-full">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, }} transition={{ duration: 0.6  }} className="content" id="main-contain">
                <div className="container-fluid container-left-right-space">
                        <header className="">
                            <div className="pl-1 pr-1 flex items-center justify-between mobile-view-block">
                                <div className="flex items-center">
                                    <p className="font-size-35 font-bold tracking-normal heading-title-text-color mb-0 cursor-pointer">
                                    Inventory <span className="font-normal">|</span>  
                                    <span className="font-size-28 pl-2">Products</span>
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <div className="mr-5">
                                        <button className="heading-title-text-color vender-btn-style text-center font-bold tracking-normal text-center rounded-full font-size-18">
                                            Vendors
                                        </button>
                                    </div>
                                    <div className="mr-5">
                                        <div className="relative">
                                            <div className="notification-round cursor-pointer flex items-center justify-center">
                                                <i class="far fa-bell font-size-25"></i>
                                            </div>
                                            <div className="alert-round"></div>
                                        </div> 
                                    </div>
                                    <div>
                                        <div className="notification-round cursor-pointer flex items-center justify-center relative setting-header-icon">
                                            <NavLink to="/setting">
                                                <img src={require("../../../assets/img/new-setting.png").default} />
                                            </NavLink>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </header>
                        <section>
                            <div className="md:flex mobile-view-mt-1 pt-2">
                                <div className="md:w-full">
                                    <div className="search-banner p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="">
                                                    <div class="flex items-center">
                                                        <form className="w-full product-input">
                                                            <div class="relative">
                                                                <span class="absolute inset-y-0 left-0 flex items-center pl-2">
                                                                    <button type="submit" class="p-1 focus:outline-none focus:shadow-outline">
                                                                        <img src={require("../../../assets/img/SearchIcon.svg").default} />
                                                                    </button>
                                                                </span>

                                                                <input type="search" name="q" class="w-full py-2  dark-text-color font-medium pl-10 serchbar-style" placeholder="Search product (category, brand, code)"/>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="mr-5">
                                                    <div className="prduct-btn flex items-center justify-center">
                                                        <img src={require("../../../assets/img/product-file.png").default}/>
                                                    </div>
                                                </div>
                                                <div className="mr-5">
                                                    <div className="prduct-btn flex items-center justify-center">
                                                        <img src={require("../../../assets/img/product-expert.png").default}/>
                                                    </div>
                                                </div>
                                                <div>
                                                    <button className="cus-medium-btn font-size-16 font-medium tracking-normal white-text-color tracking-normal">
                                                        Add New
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section className="pt-6">
                            <div className="md:flex">
                                <div className="md:w-full">
                                    <div className="dashboard-box p-3 service-box-height t-mt-1">
                                        <div className="product-table">
                                            <table width="100%" className="product-details-table">
                                                <tr className="top-border-none">
                                                    <th class="text-left">
                                                        <p className="font-size-18 font-medium tracking-normal heading-title-text-color">
                                                            Brand
                                                        </p>
                                                        <p className="font-size-18 font-medium tracking-normal heading-title-text-color mb-0">
                                                            All
                                                        </p>
                                                    </th>
                                                    <th class="text-left">
                                                        <p className="font-size-18 font-medium tracking-normal heading-title-text-color">Product name</p>
                                                        <p className="font-size-18 font-medium tracking-normal heading-title-text-color mb-0">
                                                            Best sellers
                                                        </p>
                                                    </th>
                                                    <th class="text-center">
                                                        <p className="font-size-18 font-medium tracking-normal heading-title-text-color mb-0">Product code</p>
                                                    </th>
                                                    <th class="text-center">
                                                        <p className="font-size-18 font-medium tracking-normal heading-title-text-color">
                                                            Stock in hand
                                                        </p>
                                                        <p className="font-size-18 font-medium tracking-normal heading-title-text-color mb-0">
                                                            Sort by Max
                                                        </p>
                                                    </th>
                                                    <th class="text-center">
                                                        <p className="font-size-18 font-medium tracking-normal heading-title-text-color">
                                                            Quantity per unit
                                                        </p>
                                                    </th>
                                                    <th class="text-center">
                                                        <p className="font-size-18 font-medium tracking-normal heading-title-text-color">
                                                            Retail price
                                                        </p>
                                                    </th>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p className="font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            Wella Professionals
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            Intense Repair Shampoo
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            000001
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            20
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            250 ml
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <div className="flex items-center right-icon-table justify-center">
                                                            <p className="text-center font-size-20 heading-title-text-color font-bold tracking-normal mb-0">
                                                                {SettingInfo?.currentType} 1050
                                                            </p>
                                                            <i class="fas fa-chevron-right pl-2"></i>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p className="font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            Wella Professionals
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            Intense Repair Shampoo
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            000001
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            20
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            250 ml
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <div className="flex items-center right-icon-table justify-center">
                                                            <p className="text-center font-size-20 heading-title-text-color font-bold tracking-normal mb-0">
                                                                {SettingInfo?.currentType} 1050
                                                            </p>
                                                            <i class="fas fa-chevron-right pl-2"></i>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p className="font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            Wella Professionals
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            Intense Repair Shampoo
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            000001
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            20
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            250 ml
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <div className="flex items-center right-icon-table justify-center">
                                                            <p className="text-center font-size-20 heading-title-text-color font-bold tracking-normal mb-0">
                                                                {SettingInfo?.currentType} 1050
                                                            </p>
                                                            <i class="fas fa-chevron-right pl-2"></i>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p className="font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            Wella Professionals
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            Intense Repair Shampoo
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            000001
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            20
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            250 ml
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <div className="flex items-center right-icon-table justify-center">
                                                            <p className="text-center font-size-20 heading-title-text-color font-bold tracking-normal mb-0">
                                                                {SettingInfo?.currentType} 1050
                                                            </p>
                                                            <i class="fas fa-chevron-right pl-2"></i>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p className="font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            Wella Professionals
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            Intense Repair Shampoo
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            000001
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            20
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            250 ml
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <div className="flex items-center right-icon-table justify-center">
                                                            <p className="text-center font-size-20 heading-title-text-color font-bold tracking-normal mb-0">
                                                                {SettingInfo?.currentType} 1050
                                                            </p>
                                                            <i class="fas fa-chevron-right pl-2"></i>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p className="font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            Wella Professionals
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            Intense Repair Shampoo
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            000001
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            20
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            250 ml
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <div className="flex items-center right-icon-table justify-center">
                                                            <p className="text-center font-size-20 heading-title-text-color font-bold tracking-normal mb-0">
                                                                {SettingInfo?.currentType} 1050
                                                            </p>
                                                            <i class="fas fa-chevron-right pl-2"></i>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p className="font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            Wella Professionals
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            Intense Repair Shampoo
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            000001
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            20
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            250 ml
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <div className="flex items-center right-icon-table justify-center">
                                                            <p className="text-center font-size-20 heading-title-text-color font-bold tracking-normal mb-0">
                                                                {SettingInfo?.currentType} 1050
                                                            </p>
                                                            <i class="fas fa-chevron-right pl-2"></i>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p className="font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            Wella Professionals
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            Intense Repair Shampoo
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            000001
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            20
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            250 ml
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <div className="flex items-center right-icon-table justify-center">
                                                            <p className="text-center font-size-20 heading-title-text-color font-bold tracking-normal mb-0">
                                                                {SettingInfo?.currentType} 1050
                                                            </p>
                                                            <i class="fas fa-chevron-right pl-2"></i>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p className="font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            Wella Professionals
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            Intense Repair Shampoo
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            000001
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            20
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            250 ml
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <div className="flex items-center right-icon-table justify-center">
                                                            <p className="text-center font-size-20 heading-title-text-color font-bold tracking-normal mb-0">
                                                                {SettingInfo?.currentType} 1050
                                                            </p>
                                                            <i class="fas fa-chevron-right pl-2"></i>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p className="font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            Wella Professionals
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            Intense Repair Shampoo
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            000001
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            20
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            250 ml
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <div className="flex items-center right-icon-table justify-center">
                                                            <p className="text-center font-size-20 heading-title-text-color font-bold tracking-normal mb-0">
                                                                {SettingInfo?.currentType} 1050
                                                            </p>
                                                            <i class="fas fa-chevron-right pl-2"></i>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p className="font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            Wella Professionals
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            Intense Repair Shampoo
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            000001
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            20
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            250 ml
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <div className="flex items-center right-icon-table justify-center">
                                                            <p className="text-center font-size-20 heading-title-text-color font-bold tracking-normal mb-0">
                                                                {SettingInfo?.currentType} 1050
                                                            </p>
                                                            <i class="fas fa-chevron-right pl-2"></i>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p className="font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            Wella Professionals
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            Intense Repair Shampoo
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            000001
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            20
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            250 ml
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <div className="flex items-center right-icon-table justify-center">
                                                            <p className="text-center font-size-20 heading-title-text-color font-bold tracking-normal mb-0">
                                                                {SettingInfo?.currentType} 1050
                                                            </p>
                                                            <i class="fas fa-chevron-right pl-2"></i>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p className="font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            Wella Professionals
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            Intense Repair Shampoo
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            000001
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            20
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            250 ml
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <div className="flex items-center right-icon-table justify-center">
                                                            <p className="text-center font-size-20 heading-title-text-color font-bold tracking-normal mb-0">
                                                                {SettingInfo?.currentType} 1050
                                                            </p>
                                                            <i class="fas fa-chevron-right pl-2"></i>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p className="font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            Wella Professionals
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            Intense Repair Shampoo
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            000001
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            20
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            250 ml
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <div className="flex items-center right-icon-table justify-center">
                                                            <p className="text-center font-size-20 heading-title-text-color font-bold tracking-normal mb-0">
                                                                {SettingInfo?.currentType} 1050
                                                            </p>
                                                            <i class="fas fa-chevron-right pl-2"></i>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p className="font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            Wella Professionals
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            Intense Repair Shampoo
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            000001
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            20
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            250 ml
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <div className="flex items-center right-icon-table justify-center">
                                                            <p className="text-center font-size-20 heading-title-text-color font-bold tracking-normal mb-0">
                                                                {SettingInfo?.currentType} 1050
                                                            </p>
                                                            <i class="fas fa-chevron-right pl-2"></i>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p className="font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            Wella Professionals
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            Intense Repair Shampoo
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            000001
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            20
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            250 ml
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <div className="flex items-center right-icon-table justify-center">
                                                            <p className="text-center font-size-20 heading-title-text-color font-bold tracking-normal mb-0">
                                                                {SettingInfo?.currentType} 1050
                                                            </p>
                                                            <i class="fas fa-chevron-right pl-2"></i>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p className="font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            Wella Professionals
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            Intense Repair Shampoo
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            000001
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            20
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            250 ml
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <div className="flex items-center right-icon-table justify-center">
                                                            <p className="text-center font-size-20 heading-title-text-color font-bold tracking-normal mb-0">
                                                                {SettingInfo?.currentType} 1050
                                                            </p>
                                                            <i class="fas fa-chevron-right pl-2"></i>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p className="font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            Wella Professionals
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            Intense Repair Shampoo
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            000001
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            20
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                            250 ml
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <div className="flex items-center right-icon-table justify-center">
                                                            <p className="text-center font-size-20 heading-title-text-color font-bold tracking-normal mb-0">
                                                                {SettingInfo?.currentType} 1050
                                                            </p>
                                                            <i class="fas fa-chevron-right pl-2"></i>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </motion.div>
            </div>
    )
}
