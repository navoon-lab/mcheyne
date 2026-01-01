import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/* =========================
   1. 맥체인 365일 기본 데이터
   ========================= */
const MCHEYNE_PLAN = [
  { track1: '창 1-4', track2: '마 1-2', track3: '시 1-2', track4: '행 1-2' },
  { track1: '창 5-8', track2: '마 3-4', track3: '시 3-4', track4: '행 3-4' },
  { track1: '창 9-12', track2: '마 5-6', track3: '시 5-6', track4: '행 5-6' },
  // …
  // ⚠️ 실제 사용 시 반드시 365개까지 채우십시오
];

/* =========================
   2. 날짜 → 연중 일수 (0~364)
   ========================= */
const getDayOfYear = (date) => {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

const BibleReadingApp = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [completedReadings, setCompletedReadings] = useState({});

  /* =========================
     3. 하루 2일치 읽기 (2독)
     ========================= */
  const getCurrentReading = () => {
    const index = getDayOfYear(selectedDate);
    const today = MCHEYNE_PLAN[index % MCHEYNE_PLAN.length];
    const tomorrow = MCHEYNE_PLAN[(index + 1) % MCHEYNE_PLAN.length];

    return {
      track1: `${today.track1} / ${tomorrow.track1}`,
      track2: `${today.track2} / ${tomorrow.track2}`,
      track3: `${today.track3} / ${tomorrow.track3}`,
      track4: `${today.track4} / ${tomorrow.track4}`,
    };
  };

  const currentReading = getCurrentReading();

  /* =========================
     4. 체크 상태 관리 (기존 유지)
     ========================= */
  const getReadingKey = (date, track) => {
    return `${date.toISOString().slice(0, 10)}-${track}`;
  };

  const toggleReading = (track) => {
    const key = getReadingKey(selectedDate, track);
    setCompletedReadings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isReadingCompleted = (date, track) => {
    const key = getReadingKey(date, track);
    return completedReadings[key] || false;
  };

  /* =========================
     5. 진행률 계산 (2독 기준)
     ========================= */
  const calculateProgress = () => {
    const totalTracks = 365 * 4 * 2;
    const completed = Object.values(completedReadings).filter(Boolean).length;
    return ((completed / totalTracks) * 100).toFixed(1);
  };

  const progress = calculateProgress();

  /* =========================
     6. 캘린더 UI (기존 유지)
     ========================= */
  const changeMonth = (direction) => {
    const newDate = new Date(calendarDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCalendarDate(newDate);
  };

  const renderCalendar = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`e-${i}`} />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const isSelected = selectedDate.toDateString() === date.toDateString();
      const isToday = new Date().toDateString() === date.toDateString();

      days.push(
        <div
          key={d}
          onClick={() => {
            setSelectedDate(date);
            setCalendarDate(date);
          }}
          className={`h-12 flex items-center justify-center rounded-full cursor-pointer
            ${isSelected ? 'bg-purple-500 text-white' : ''}
            ${isToday && !isSelected ? 'border border-purple-500' : ''}`}
        >
          {d}
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-7 text-center mb-2">
          {weekDays.map(d => <div key={d}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-2">{days}</div>
      </>
    );
  };

  /* =========================
     7. 렌더링 (UI 그대로)
     ========================= */
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white min-h-screen">
      <div className="flex justify-between mb-8">
        <h1 className="text-2xl">
          {selectedDate.toLocaleDateString('ko-KR')}
        </h1>
        <button onClick={() => setSelectedDate(new Date())} className="text-purple-600">
          오늘
        </button>
      </div>

      <div className="bg-gray-50 rounded-3xl p-8 mb-8">
        <div className="grid grid-cols-4 gap-6">
          {['track1', 'track2', 'track3', 'track4'].map((track, i) => (
            <div key={track} className="text-center">
              <div
                onClick={() => toggleReading(i + 1)}
                className={`w-20 h-20 rounded-full border-2 flex items-center justify-center mx-auto cursor-pointer
                  ${isReadingCompleted(selectedDate, i + 1)
                    ? 'bg-purple-500 text-white border-purple-500'
                    : 'border-gray-300'}`}
              >
                <span className="text-xs">{currentReading[track]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mb-8">
        <p className="mb-2">주님께 날마다 나아가도록 도와주십시오.</p>
        <p>2독 진행률: {progress}%</p>
      </div>

      <div className="border-t pt-6">
        <div className="flex justify-between mb-4">
          <button onClick={() => changeMonth(-1)}><ChevronLeft /></button>
          <h2>{calendarDate.getMonth() + 1}월</h2>
          <button onClick={() => changeMonth(1)}><ChevronRight /></button>
        </div>
        {renderCalendar()}
      </div>
    </div>
  );
};

export default BibleReadingApp;
