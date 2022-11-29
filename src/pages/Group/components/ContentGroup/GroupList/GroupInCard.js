/* eslint-disable react/button-has-type */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/self-closing-comp */
/* eslint-disable jsx-a11y/anchor-is-valid */
import Card from 'react-bootstrap/Card';
import { Dropdown } from 'react-bootstrap';
import { MdDateRange, MdPersonRemove, MdOutlineReport } from 'react-icons/md';
import { forwardRef } from 'react';
import { groupBg } from '~/img';
import './style.scss';

const CustomToggle = forwardRef(({ children, onClick }, ref) => (
  <a
    href="#"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    style={{ color: '#000', textDecoration: 'none' }}
  >
    {children}
    <span className="threedots" />
  </a>
));

function GroupInCard({ groupId, groupName, owner, description }) {
  return (
    // <Card style={{ width: '18rem' }}>
    //   <Card.Img
    //     onClick={() => {
    //       window.location.href = '/group/'.concat(groupId);
    //     }}
    //     role="button"
    //     variant="top"
    //     src={groupBg}
    //   />
    //   <Card.Body>
    //     <Card.Header className="d-flex justify-content-between">
    //       <Card.Title
    //         onClick={() => {
    //           window.location.href = '/group/'.concat(groupId);
    //         }}
    //         role="button"
    //         className=""
    //       >
    //         {groupName}
    //       </Card.Title>
    //       <Dropdown>
    //         <Dropdown.Toggle as={CustomToggle} />
    //         <Dropdown.Menu>
    //           <Dropdown.Item>Move</Dropdown.Item>
    //           <Dropdown.Divider />
    //           <Dropdown.Item>Unenroll</Dropdown.Item>
    //         </Dropdown.Menu>
    //       </Dropdown>
    //     </Card.Header>
    //     <Card.Title
    //       onClick={() => {
    //         window.location.href = '/group/'.concat(groupId);
    //       }}
    //       role="button"
    //     >
    //       {owner}
    //     </Card.Title>
    //     <Card.Subtitle
    //       onClick={() => {
    //         window.location.href = '/group/'.concat(groupId);
    //       }}
    //       role="button"
    //     >
    //       {description}
    //     </Card.Subtitle>
    //   </Card.Body>
    // </Card>
    <div>
      <ul>
        <div
          className="booking-card"
          //   style="background-image: url(https://images.unsplash.com/photo-1578944032637-f09897c5233d?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ)"
        >
          <div className="book-container">
            <div className="content">
              <button
                onClick={() => {
                  window.location.href = '/group/'.concat(groupId);
                }}
                className="btn"
              >
                Detail
              </button>
            </div>
          </div>
          <div className="informations-container">
            <h2 className="title">{groupName}</h2>
            <p className="sub-title">{owner}</p>
            <p className="price">
              <MdDateRange size={25} />
              Start Date
            </p>
            <div className="more-information">
              <div className="info-and-date-container">
                <div className="box info">
                  <MdOutlineReport size={30} />
                  <p>Report</p>
                </div>
                <div className="box date">
                  <MdPersonRemove size={30} />
                  <p>Unenroll</p>
                </div>
              </div>
              <p className="disclaimer">
                Samedi 1er février 2020{description}
                {description}
                {description}
                {description}
                {description}
                {description}
              </p>
            </div>
          </div>
        </div>
      </ul>
    </div>
  );
}

export default GroupInCard;
