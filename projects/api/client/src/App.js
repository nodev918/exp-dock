import React from "react";

export default function App() {
  // m1 是模擬資料
  const m1 = [
    { id: "T1_BOW", city: "Taipei" },
    { id: "T2_HAMMER", city: "Hualien" },
    { id: "T3_BOW", city: "Tainan" },
  ];
  //mock1 是存放m1的全域變數
  const [mock1, setMock1] = React.useState(m1);
  const [target, setTarget] = React.useState([]);
  const [newtarget, setNewtarget] = React.useState([]);
  function setArray(list) {
    for (let i = 0; i < list.length; i++) {
      list[i].nid = i;  
      const node = list[i];
      newtarget.push(node);
    }
  }
  return (
    <div>
      {mock1.map((item) => {
        if (item.id.includes("BOW")) {
          target.push(item);
          console.log(item);
        }
      })}
      {setArray(target)}
      {newtarget.map((item) => {
        console.log(item);
      })}
    </div>
  );
}
