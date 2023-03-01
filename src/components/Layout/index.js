// import React, { Component } from 'react';
// import { connect } from 'react-redux';


// import { Col, Row, } from "react-bootstrap";

// import Topbar from './Topbar';
// import Sidebar from './Sidebar';
// import Footer from './Footer';
// import { isSuperAdmin, isDistributor } from '@/helpers';

// // render if Auth Layout
// const AuthLayoutContent = (props) => {
//   // console.log("CHILDREN",props.children.type.displayName.slice(8,props.children.type.displayName.length-1));
//   return (
//     <>
//       <div className='p-0 m-0'>
//         <Topbar isSearch={props.isSearch} />
//         <Row className={`p-0 min-vh-100 ${(isSuperAdmin() || isDistributor()) ? 'margin-xs' : ''}`} style={{ margin: '64px 0 0' }}>
//           {!props.isSearch ? <Sidebar /> : ''}
//           <Col
//             md={!props.isSearch ? 9 : 12}
//             lg={!props.isSearch ? 10 : 12}
//             xl={!props.isSearch ? 10 : 12}
//             className='Bg-light d-flex flex-column'
//             style={{ position: 'absolute', right: 0, paddingBottom: '45px' }}
//           >
//             {/* <AddressBar page={props.children.type.displayName.slice(8,props.children.type.displayName.length-1)} /> */}
//             {props.children}
//             <Footer />
//           </Col>
//         </Row>
//       </div>
//     </>
//   )
// }


// class Layout extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {};
//   }

//   render() {
//     return (
//       <>
//         <AuthLayoutContent {...this.props} />
//       </>
//     );
//   }
// }

// const mapStatetoProps = state => {
//   return {
//     layout: state.Layout
//   };
// }

// export default connect(mapStatetoProps)(Layout);
