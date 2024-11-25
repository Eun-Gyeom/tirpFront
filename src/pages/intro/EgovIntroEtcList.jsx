import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

import * as EgovNet from 'api/egovFetch';
import URL from 'constants/url';
import CODE from 'constants/code';

import { default as EgovLeftNav } from 'components/leftmenu/EgovLeftNavIntro';

function EgovIntroEtcList(props) {
  const location = useLocation();
  console.log('EgovIntroEtcList [location] : ', location);

  const DATE = new Date();
  const FIRST_DAY_OF_THIS_WEEK = new Date(
    DATE.getFullYear(),
    DATE.getMonth(),
    DATE.getDate() - DATE.getDay()
  );

  const getWeekOfMonth = (date) => {
    let adjustedDate = date.getDate() + date.getDay();
    console.log(
      'getWeekOfMonth : ',
      date,
      date.getDate(),
      date.getDay(),
      adjustedDate,
      adjustedDate / 7,
      0 | (adjustedDate / 7)
    );
    let weeksOrder = [0, 1, 2, 3, 4, 5];
    let returnVal = parseInt(weeksOrder[0 | (adjustedDate / 7)]);
    console.log('returnVal:', returnVal);
    return returnVal;
  };

  const [searchCondition, setSearchCondition] = useState(
    location.state?.searchCondition || {
      schdulSe: '',
      year: FIRST_DAY_OF_THIS_WEEK.getFullYear(),
      month: FIRST_DAY_OF_THIS_WEEK.getMonth(),
      date: FIRST_DAY_OF_THIS_WEEK.getDate(),
      weekDay: FIRST_DAY_OF_THIS_WEEK.getDay(),
      weekOfMonth: getWeekOfMonth(FIRST_DAY_OF_THIS_WEEK),
    }
  );

  const [scheduleList, setScheduleList] = useState([]);
  const [listTag, setListTag] = useState([]);

  const changeDate = (target, amount) => {
    let changedDate;

    if (target === CODE.DATE_YEAR) {
      changedDate = new Date(
        searchCondition.year + amount,
        searchCondition.month,
        searchCondition.date
      );
    }

    if (target === CODE.DATE_MONTH) {
      changedDate = new Date(
        searchCondition.year,
        searchCondition.month + amount,
        searchCondition.date
      );
    }

    if (target === CODE.DATE_WEEK) {
      // let addtionOfDays = 7 * amount - searchCondition.weekDay;
      let addtionOfDays = 7 * amount;
      changedDate = new Date(
        searchCondition.year,
        searchCondition.month,
        searchCondition.date + addtionOfDays
      ); //다음주의 첫날
    }
    console.log('changedDate : ', changedDate);
    setSearchCondition({
      ...searchCondition,
      year: changedDate.getFullYear(),
      month: changedDate.getMonth(),
      date: changedDate.getDate(),
      weekDay: changedDate.getDay(),
      weekOfMonth: getWeekOfMonth(changedDate),
    });
  };

  const drawList = useCallback(() => {
    let mutListTag = [];

    mutListTag.push(
      <div id='linkTest'>
        <Link to={URL.INTRO_ETC}>
          <div className='list_item' key={''}>
            <div>1</div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
            <div>5</div>
            <div>6</div>
          </div>
        </Link>
      </div>
    );
    setListTag(mutListTag);
  }, [
    scheduleList,
    searchCondition.date,
    searchCondition.month,
    searchCondition.year,
  ]);

  const retrieveList = useCallback(
    (srchcnd) => {
      console.groupCollapsed('EgovIntroSrchDown.retrieveList()');

      const retrieveListURL =
        '/schedule/week' + EgovNet.getQueryString(srchcnd);
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      };

      EgovNet.requestFetch(
        retrieveListURL,
        requestOptions,
        (resp) => {
          setScheduleList(resp.result.resultList);
          drawList();
        },
        function (resp) {
          console.log('err response : ', resp);
        }
      );

      console.groupEnd('EgovIntroSrchDown.retrieveList()');
    },
    [drawList]
  );

  const Location = React.memo(function Location() {
    return (
      <div className='location'>
        <ul>
          <li>
            <Link to={URL.MAIN} className='home'>
              Home
            </Link>
          </li>
          <li>
            <Link to={URL.INTRO}>기타(교육, 휴가)</Link>
          </li>
          <li>조회</li>
        </ul>
      </div>
    );
  });

  const getTimeForm = (str) => {
    let hour = str.substring(8, 10);
    let starminute = str.substring(10, 12);
    return hour + ':' + starminute;
  };

  useEffect(() => {
    retrieveList(searchCondition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchCondition]);

  useEffect(() => {
    fn_srchEtcData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleList]);

  const fn_srchEtcData = () => {
    console.log('????????????????');
    // body에 사번으로 조회
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      //body: JSON.stringify(),
    };

    EgovNet.requestFetch(`/srchEtc`, requestOptions, function (resp) {
      console.log('정상!!!');
      var data = resp.result.result;
      console.log(data);

      let mutListTag = [];
      mutListTag = [];
      data.forEach((item, i) => {
        mutListTag.push(
          <div id='linkTest'>
            <Link to={URL.INTRO_ETC}>
              <div className='list_item' key={i}>
                <div>{item.gubun}</div>
                <div>{item.gubun_detail}</div>
                <div>{item.edu_nm}</div>
                <div>{item.st_dt}</div>
                <div>{item.end_dt}</div>
                <div>{item.bigo}</div>
              </div>
            </Link>
          </div>
        );
      });

      setListTag(mutListTag);
    });
  };

  console.log('----------------------------EgovIntroSrchDown [End]');
  console.groupEnd('EgovIntroSrchDown');
  return (
    <div className='container'>
      <div className='c_wrap'>
        {/* <!-- Location --> */}
        <Location />
        {/* <!--// Location --> */}

        <div className='layout'>
          {/* <!-- Navigation --> */}
          <EgovLeftNav />
          {/* <!--// Navigation --> */}

          <div className='contents WEEK_SCHEDULE' id='contents'>
            {/* <!-- 본문 --> */}

            <div className='top_tit'>
              <h1 className='tit_1'>기타(교육, 휴가)</h1>
            </div>

            <h2 className='tit_2'>조회</h2>

            {/* <!-- 검색조건 --> */}
            <div className='condition'>
              <ul>
                <li>
                  <button
                    className='prev'
                    onClick={() => {
                      changeDate(CODE.DATE_YEAR, -1);
                    }}
                  ></button>
                  <span>{searchCondition.year}년</span>
                  <button
                    className='next'
                    onClick={() => {
                      changeDate(CODE.DATE_YEAR, 1);
                    }}
                  ></button>
                </li>
                <li className='half L'>
                  <button
                    className='prev'
                    onClick={() => {
                      changeDate(CODE.DATE_MONTH, -1);
                    }}
                  ></button>
                  <span>{searchCondition.month + 1}월</span>
                  <button
                    className='next'
                    onClick={() => {
                      changeDate(CODE.DATE_MONTH, 1);
                    }}
                  ></button>
                </li>
                <li className='half R'>
                  <button
                    className='prev'
                    onClick={() => {
                      changeDate(CODE.DATE_WEEK, -1);
                    }}
                  ></button>
                  <span>{searchCondition.weekOfMonth + 1}주</span>
                  <button
                    className='next'
                    onClick={() => {
                      changeDate(CODE.DATE_WEEK, 1);
                    }}
                  ></button>
                </li>
                <li>
                  <Link
                    to={URL.INFORM_NOTICE_CREATE}
                    //state={{ bbsId: bbsId }}
                    className='btn btn_blue_h46 pd35'
                  >
                    등록
                  </Link>
                </li>
              </ul>
            </div>
            {/* <!--// 검색조건3 3--> */}

            {/* <!-- 게시판목록 --> */}
            <div className='board_list BRD004'>
              <div className='head'>
                <span>구분</span>
                <span>구분상세</span>
                <span>교육명</span>
                <span>시작일자</span>
                <span>종료일자</span>
                <span>기타</span>
              </div>
              <div className='result'>{listTag}</div>
            </div>
            {/* <!--// 게시판목록 --> */}

            {/* <!--// 본문 --> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EgovIntroEtcList;