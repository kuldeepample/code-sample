import { isSuperAdmin } from '@/helpers';
import React from 'react';
import { Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import Footer from './Footer';
import SideNav from './SideNav'
import Topbar from './Topbar';

function DefaultLayout(props) {

    const loading = useSelector((state) => state.auth.loading)
    const toggleSideNav = (e) => {
        let el = document.getElementById('sideNav')
        e?.target.checked ? el.classList.remove('sideNav', 'isSearchNav') : el.classList.add('sideNav', `${props.isSearch && 'isSearchNav'}`);

        if (props.isSearch) {
            let content = document.getElementById('content')
            e?.target.checked ? content.classList.replace('fullBody', 'body') : content.classList.replace('body', 'fullBody')
        }
    }

    return (
        <div>
            <SideNav isSearch={props.isSearch} toggleSideNav={toggleSideNav} />
            <div className="wrapper d-flex flex-column min-vh-100">
                <Topbar toggleSideNav={toggleSideNav} isSearch={props.isSearch} />
                <div className={`${props.isSearch ? 'fullBody' : 'body'} ${isSuperAdmin() ? 'mt-5' : 'mt-0'} flex-grow-1 px-3 mb-5 d-flex flex-column mt-sm-0`} id='content'>
                    {loading ?
                        <div className='d-flex center flex-grow-1'>
                            <Spinner animation='border' className='d-flex align-self-center' />
                        </div>
                        :
                        props.children
                    }
                </div>
                <Footer />
            </div>
        </div>
    )
}

export default DefaultLayout