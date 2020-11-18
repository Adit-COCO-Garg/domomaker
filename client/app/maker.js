const handleDomo = (e) => {
  e.preventDefault();
  $("#domoMessage").animate({width:"hide"},350);
  if ($("#domoName").val() == "" || $("#domoAge").val() == "" || $("#domoimg").val() == "") {
    handleError("Rawr! all fields required!");
    return false;
  };
  sendAjax('POST', $("domoForm").attr("action"), $("#domoForm").serialize(), function(){
    loadDomosFromServer();
  });
  console.log($("#domoForm").serialize());
  return false;
};

const DomoForm = (props) => {
  return (
    <form id="domoForm" onSubmit={handleDomo} name="domoForm" action="/maker" method="POST" className="domoForm">
      <label htmlFor="name">Name: </label>
      <input id="domoName" type="text" name="name" autoFocus placeholder="Domo Name"/>
      <label htmlFor="age">Age: </label>
      <input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
      <label htmlFor="img">Img: </label>
      <input id="domoimg" type="text" name="img" placeholder="Domo Img"/>
      <input type="hidden" name="_csrf" id="_csrfT" value={props.csrf}/>
      <input className="makeDomoSubmit" type="submit" value="MakeDomo"/>
    </form>
  )
}

const loadDomosFromServer = () => {
  sendAjax("GET","/getDomos", null, (data)=> {
    ReactDOM.render(
      <DomoList domos={data.domos} />, document.querySelector("#domos")
    );
  });
};

const DomoList = (props) => {
  if (props.domos.length === 0) {
    return (
      <div className="domoList">
        <h3 className="emptyDomo">No Domos Yet!</h3>
      </div>
    );
  };
  const domoNodes = props.domos.map((domo)=> (
      <div key={domo._id} className="domo">
        <button className="delBtn" onClick={(e) => deleteThisDomo(domo._id)}>delete me</button>
        <img src={domo.img} alt="domo face" className = "domoFace"/>
        <h3 className="domoName">Name: {domo.name} </h3>
        <h3 className="domoAge">Age: {domo.age} </h3>
      </div>
    )
  );
  return (
    <div className="domoList">
      {domoNodes}
    </div>
  )
};


const setup = (csrf) => {
  
  ReactDOM.render(
    <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
  );
  ReactDOM.render(
    <DomoList domos={[]} />, document.querySelector("#domos")
  );
  loadDomosFromServer();
}

const getToken = () => {
  sendAjax("GET", "/getToken",null, (result)=> {
    setup(result.csrfToken)
  });
};

const deleteThisDomo = (id) => {
  const csrfVal = document.querySelector(`#_csrfT`).value;
  console.log(csrfVal);
  sendAjax("post", "/delDomo", {_csrf: csrfVal, id: id}, (e)=> {
    loadDomosFromServer();
  });
};

$(document).ready(()=>{
  getToken();
})