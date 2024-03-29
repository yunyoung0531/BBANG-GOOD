import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import Swal from "sweetalert2";
import { addToCart } from '../store/dataSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { changePlusCnt } from '../store';
import { Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Detail(props) {
    let [count, setCount] = useState(0);
    let [alert, setAlert] = useState(1);
    let [input, setInput] = useState('');
    let [warning, setWarning] = useState(false);
    let [tab, setTab] = useState(0);

    let dispatch = useDispatch();
    let {id} = useParams();
    let selectedItem = props.items[id];
    let cart = useSelector(state => state.data);

    let navigate = useNavigate();


    // 최근 본 상품 기능
    useEffect(()=>{
        console.log(selectedItem.id);
        let watchedItems = localStorage.getItem('watched');
        if (watchedItems) {
            watchedItems = JSON.parse(watchedItems);
        } else {
            watchedItems = [];
        }
        if(!watchedItems.includes(selectedItem.id)) {
            watchedItems.push(selectedItem.id);
        }
        while (watchedItems.length > 5) {
            watchedItems.shift();
        }
        localStorage.setItem('watched', JSON.stringify(watchedItems));
    }, [])

    const handleInputChange = (e) => {
        const value = e.target.value;
        if (isNaN(value)) {
            setWarning(true);
        } else {
            setInput(value);
        }
    }

    useEffect(() => {
        if (warning == true) {
            Swal.fire('숫자만 입력하세요');
            setWarning(false);
        }
    }, [warning]);

    let [fade, setFade] = useState('');

    useEffect(()=>{
        setTimeout(()=>{setFade('end')}, 100)
        return () => {
            setFade('')
        }
    }, [])

    // 모달창 관련 변수
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
        <div className={'start ' + fade}>
        <div className="container">
        {/* {alert == 1 ? 
        (<div className='alert alert-warning'>
            2초 이내 구매시 할인!
        </div>) : null}
            {count}
        <button onClick={()=>{ setCount(count + 1); setAlert(1) }}>버튼</button> */}
        <div className="row detail-item">
            <div className="col-md-6 detail-img">
            <img src={props.items[id].image} width="50%" />
            </div>
            <div className="col-md-6">
            <h4 className="pt-5">{props.items[id].title}</h4>
            <p>{props.items[id].content}</p>
            <h5>{props.items[id].price}원</h5>
            <Button variant="outline-light" className="goToCartBtn" onClick={()=>{
                handleShow();
                let isItemInCart = cart.some(item => item.id === selectedItem.id);
                if (!isItemInCart) {
                    dispatch(addToCart({
                        id: selectedItem.id,
                        name: selectedItem.title,
                        count: 1
                    }));
                } else {
                    dispatch(changePlusCnt(selectedItem.id));
                }
            }}>주문하기</Button> 
            </div>
        </div>
        </div>

        <Modal show={show} onHide={handleClose} animation={false} className='modal-cart'>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>장바구니에 담았어요 !</Modal.Body>
        <Modal.Footer>
            <Button variant="outline-light" onClick={handleClose} className='goToCartBtn'>
                쇼핑 계속 하기
            </Button>
            <Button variant="outline-light" onClick={()=>{navigate('/cart')}} className='goToCartBtn'>
                장바구니로 이동
            </Button>
        </Modal.Footer>
        </Modal>

        <Nav variant="tabs"  defaultActiveKey="link0">
            <Nav.Item>
            <Nav.Link eventKey="link0" onClick={() => setTab(0)} className='tab0 tab-color'>치즈 페스티벌</Nav.Link>
            </Nav.Item>
            <Nav.Item>
            <Nav.Link eventKey="link1" onClick={() => setTab(1)} className='tab1 tab-color'>한정판매 - 곰돌이 텀블러</Nav.Link>
            </Nav.Item>
            <Nav.Item>
            <Nav.Link eventKey="link2" onClick={() => setTab(2)} className='tab2 tab-color'>신메뉴 - 도넛</Nav.Link>
            </Nav.Item>
        </Nav>
        <TabContent items={props.items} tab={tab}/>
        </div>
        </>
    )
}

function TabContent(props) {
    let [fade, setFade] = useState('');
    let targetIds0 = [4, 11, 18, 19];
    let displayDessert0 = props.items.filter(item => targetIds0.includes(item.id));
    let targetIds1 = [20, 21];
    let displayDessert1 = props.items.filter(item => targetIds1.includes(item.id));

    useEffect(()=>{
        setTimeout(()=>{setFade('end')}, 100)
        return () => {
            setFade('')
        }
    }, [props.tab])

    if (props.tab == 0) {
        return <div className={'start ' + fade}>
                <div className="container">
                    <div className="row centered-row">
                    {displayDessert0.map((a, i) => (
                        <div className="col-md-2 row-items card-box-tab recent-items-container justify-content-center"  key={i}>
                            <Link to={`/detail/${a.id}`}>
                                <img className='shoe-img-tab' src={a.image} />
                            </Link>
                            <h6>{a.title}</h6>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
    } else if (props.tab == 1) {
        return <div className={'start ' + fade}>
                <div className="container">
                    <div className="row centered-row">
                    {displayDessert1.map((a, i) => (
                        <div className="col-md-2 row-items card-box-tab recent-items-container justify-content-center"  key={i}>
                            <Link to={`/detail/${a.id}`}>
                                <img className='shoe-img-tab' src={a.image} />
                            </Link>
                            <h6>{a.title}</h6>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
    } else if (props.tab == 2){
        return <div className={'start ' + fade}>준비중입니다.</div>
    }
}

export default Detail;
