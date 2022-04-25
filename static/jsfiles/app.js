const store = new Vuex.Store({
  state: {
    username:sessionStorage.username,
    token:sessionStorage.token,
    newaccountcreated:false,
    loggedout:false,
  },
  mutations: {

  }
})


const homepage = {
  methods:{
    login: function(){
      this.$router.push('/login/')
    },
    signup: function(){
      this.$router.push('/signup')
    },
  },
  template:`<div>
      <link rel="stylesheet" href="/static/homepage.css">
      <nav class="navbar navbar-expand-lg navbar" style="background-color:powderblue;">
      <div class="container-fluid">
      <a class="navbar-brand navbar-expand-lg"> 
        &nbsp&nbsp&nbsp
      <img src="/static/homepageicon.png" width="30" height="30" class="d-inline-block align-top" alt="">
        FLASH CARD
      </a>
     
      <div class="navbar-brand" id="navbarNavAltMarkup">
              <ul class="navbar-nav">
              <li class="nav-item">
                <button class="btn nav-item nav-link" v-on:click="login">Login</button>
              </li>
              <li class="nav-item">
                <button class="btn nav-item nav-link" v-on:click="signup">Sign Up</button>
              </li>
              </ul>
      </div>
    </div>
    </nav>
    <br><br><br>
    <div class="container">
      <div class="row">
        <div class="col-sm index">
        &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp

          <img src="/static/homepage.png" width="350" height="400" class="d-inline-block align-top" alt="">
        </div>
        <div class="col-sm index" style="text-align:center">
        <h1>
          Flash Cards</h1> <br><h4 style="text-align:left">
            <ul>
              <li>
                Flashcards are small note cards used for testing and improving memory through practiced information retrieval
            </li><br>
            <li>Flashcards are typically two-sided, with the prompt on one side and the information about the prompt on the other</li><br>
            <li>This may include names, vocabulary, concepts, or procedures
            </li>
        </ul>
        </h4>
        </div>
      </div>
    </div>
    </div>`,
}

const loginpage = {
  data: function() {
    return {username:"",
            password:"",
            rememberme:true,
            showerror:false,
            successcreation: this.$store.state.newaccountcreated,
            loggedout: this.$store.state.loggedout,
          }
        },
        methods:{
          trylogin: async function(){
            if(this.username=="" || this.password==""){
              alert("The Username and password should not be blank");
            }
            else if(this.username.search('/') != -1 || this.password.search('/') != -1){
              alert("The Username and Password should not contain '/' character");
            }
            else{
              url="/api/login/"+this.username+"/"+this.password;
              a= await fetch(url);
              response=await a.json();
              if(response.token){
                this.$store.state.token=response.token;
                this.$store.state.username=this.username;
                this.showerror=false;
                this.$store.state.newaccountcreated=false;
                this.$store.state.loggedout=false;
                if(this.rememberme){
                  localStorage.username=this.username;
                  localStorage.password=this.password;
                }
                else{
                  localStorage.removeItem("username");
                  localStorage.removeItem("password");
                }
                sessionStorage.token=this.$store.state.token;
                sessionStorage.username=this.$store.state.username;
                this.$router.push('/deck')
              }
              else{
                this.showerror=true;
                this.$store.state.newaccountcreated=false;
                this.$store.state.loggedout=false;
                this.successcreation=false;
              }
            }
          },
          signuppage: function(){
            this.$router.push('/signup')
          },
          homepage: function(){
            this.$router.push('/')
          },
        },
        mounted: function () {
          if(localStorage.username && localStorage.password){
            this.username=localStorage.username;
            this.password=localStorage.password;
          }
        },
        template:
          `<div><br><br><link rel="stylesheet" href="/static/loginpage.css">
            <div class="container" id="login">
            <img src="/static/homepageicon.png" width="50" height="50" class="d-inline-block align-top" alt=""><br>
            <h3 v-if="successcreation">Account Created Successfully</h3>
            <h3>Login</h3><br>
            <h4 style="color:red;" v-if="loggedout">You were logged out. Please login again to continue</h4>
            <h4>Use your Flash Card App Account</h4><br>
            <label for="user_name" class="form-label">User Name (Use your E-Mail Address)</label>
            <input type="text" class="form-control" style="background-color:powderblue;" id="user_name" name="u_name" placeholder="User Name" v-model="username" required><br>
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" style="background-color:powderblue;" id="password" name="p_word" placeholder="Password" v-model="password" required><br>

            <input class="form-check-input" type="checkbox" id="defaultCheck1" v-model="rememberme">
            <label class="form-check-label" for="defaultCheck1">Remember me</label><br><br>
            
            <button class="btn btn-primary" v-on:click="trylogin">Submit</button><br><br>
            <div style="color:red;" v-if="showerror">The Username and password doesn't match</div>
            <div><button class="btn btn-info" v-on:click="signuppage">Signup page</button>&nbsp&nbsp&nbsp<button class="btn btn-info" v-on:click="homepage">Home page</button></div>
          </div></div>
        `
}

const signuppage = {
  data: function() {
          return {username:"",
            password:"",
            showerror:false,
          }
        },
        methods:{
          trysignup: async function(){
            if(this.username=="" || this.password==""){
              alert("The Username and password should not be blank");
            }
            else if(this.username.search('/') != -1 || this.password.search('/') != -1){
              alert("The Username and Password should not contain '/' character");
            }
            else{
              url="/api/signup/"+this.username+"/"+this.password;
              a= await fetch(url,{method: 'PUT'});
              response=await a.json();
              if(response==1){
                this.showerror=false;
                this.$store.state.newaccountcreated=true;
                this.$router.push('/login')
              }
              else{
                this.showerror=true;
              }
            }
          },
          loginpage: function(){
            this.$router.push('/login')
          },
          homepage: function(){
            this.$router.push('/')
          },
        },
        template:
          `<div><br><br><link rel="stylesheet" href="/static/loginpage.css">
          <div class="container" id="login">
            <img src="/static/homepageicon.png" width="50" height="50" class="d-inline-block align-top" alt=""><br>
            <h3>Sign Up</h3><br>
            <h4>Create your Flash Card App Account</h4><br>
            <label for="user_name" class="form-label">User Name (Use your E-Mail Address)</label>
            <input type="text" class="form-control" style="background-color:powderblue;" id="user_name" name="u_name" placeholder="User Name" v-model="username" required><br>
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" style="background-color:powderblue;" id="password" name="p_word" placeholder="Password" v-model="password" required><br>
            <button class="btn btn-primary" v-on:click="trysignup">Submit</button><br><br>
            <div style="color:red;" v-if="showerror">The Username is already taken. Try a different username</div>
            <div>The Username and Password should not contain '/' character</div><br>
            <div><button class="btn btn-info" v-on:click="loginpage">Login page</button>&nbsp&nbsp&nbsp<button class="btn btn-info" v-on:click="homepage">Home page</button></div>
          </div></div>`
}

const deckpage = {
  data: function(){
    return {
      present:false,
      decklist:[],
    }
  },
  methods:{
    signout: function(){
      this.$store.state.username="";
      this.$store.state.token="";
      sessionStorage.removeItem("username");
      sessionStorage.removeItem("password");
      sessionStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("password");
      localStorage.removeItem("token");
      this.$router.push('/login/');
    },
    homepage: function(){
      this.$router.push('/');
    },
    adddeck: function(){
      this.$router.push('/deck/adddeck');
    },
    play: function(e){
      deckname=this.decklist[e].deck_name;
      this.$router.push('/deck/'+deckname+'/play/')
    },
    rename: function(e){
      name=this.decklist[e].deck_name;
      this.$router.push('/deck/rename/'+name+'/');
    },
    showall: function(e){
      this.$router.push('/deck/'+this.decklist[e].deck_name+'/card/');
    },
    deletedeck: async function(e){
      url="/api/decks/deletedeck/"+this.$store.state.username+"/"+this.decklist[e].deck_name+"/"+this.$store.state.token;
      a=await fetch(url,{method: 'DELETE'});
      response=await a.json();
      if(response==0){
        this.$store.state.loggedout=true;
        this.$router.push('/login');
      }
      else if(response==1){
        this.decklist.splice(e,1);
      }
    },
    addcard: function(e){
      deckname=this.decklist[e].deck_name;
      this.$router.push('/deck/addcard/'+deckname+'/');
    },
    importcsv: function(){
      this.$router.push('/deck/importcsv');
    },
    exportdeck: async function(e){
      username=this.$store.state.username
      token=this.$store.state.token
      deckname=this.decklist[e].deck_name
      url="/api/decks/export/"+username+"/"+deckname+"/"+token;
      fetch(url)
      .then((res) => { return res.blob(); })
      .then((data) => {
        var a = document.createElement("a");
        a.href = window.URL.createObjectURL(data);
        a.download = deckname+".csv";
        a.click();
      });

      if(response==0){
        this.$store.state.loggedout=true;
        this.$router.push('/login');
      }
      else{
        fetch(url,{method: 'DELETE'});
      }
    },
  },
  beforeCreate: async function(){
    username=this.$store.state.username
    token=this.$store.state.token
    url="/api/decks/"+username+"/"+token;
    a=await fetch(url);
    response=await a.json();
    if(response==1){
     this.present=false;
    }
    else if(response==0){
      this.$store.state.loggedout=true;
      this.$router.push('/login');
    }
    else{
      this.decklist=response;
      this.present=true;
    }
  },
  template:
        `<div><link rel="stylesheet" href="/static/deckslist.css">
    <div class="container p-3 mb-5 bg-dark justify-content-md-end" id="stl">
    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
    <a class="btn btn-outline-warning" role="button" v-on:click="importcsv">Import</a>
    <a class="btn btn-danger" role="button" v-on:click="signout">Signout</a>
    <a class="btn btn-secondary" role="button" v-on:click="homepage">Homepage</a><br>
    </div>
    <img src="/static/homepageicon.png" width="80" height="80" class="d-inline-block align-top" alt=""><br>
    <div><h1>Available Decks</h1></div><br>

    <div v-if="present">
    <div id="collapse1">
    <table class="table table-dark table-striped table-hover" style="border-radius:15px;">
        <tr>
        <th>S.No</th>
        <th>Deck (PLAY)</th>
        <th>Last Reviewed</th>
        <th>Score</th>
        <th>Rename Deck</th>
        <th>Cards</th>
        <th>Delete Deck</th>
        <th>Add Card</th>
        <th>Export</th>
        </tr>
        
        <tr v-for="(deck, index) in decklist" :key="index">
        <td>{{index+1}}</td>
        <td><a class="btn btn-outline-warning btn-sm" role="button" v-on:click="play(index)">{{deck.deck_name}}</a></td>
        <td>{{deck.last_reviewed}}</td>
        <td>{{deck.score}}</td>
        <td><a class="btn btn-outline-primary btn-sm" role="button" v-on:click="rename(index)">Rename</a></td>
        <td><a class="btn btn-outline-primary btn-sm" role="button" v-on:click="showall(index)">Cards</a></td>
        <td><a class="btn btn-outline-danger btn-sm" role="button" v-on:click="deletedeck(index)">Delete</a></td>
        <td><a class="btn btn-outline-primary btn-sm" role="button" v-on:click="addcard(index)">Add Card</a></td>
        <td><a class="btn btn-outline-warning btn-sm" role="button" v-on:click="exportdeck(index)">Export</a></td>
        </tr>
    </table></div><br></div>
    <div v-if="!present">
      <h2>You don't have any decks</h2><br>
      <h4><i style="color: #ff66ff">Want to Improve language skills<br>Increase the ability to compose stories<br>Memorizing, analyzing a problem<br> This is your one stop destination<br></i><div style="color: #009933"><br><h3>Don't Forget a Thing</h3></div> To add a new deck press the button below</h4>
    </div>
    <div><h4><a class="btn btn-success" role="button" v-on:click="adddeck">Add a deck</a></h4></div>
    </div></div>`,
}

const adddeck = {
  data: function(){
    return {
      deckname:"",
      alreadyexist:false,
    }
  },
  methods: {
    signout: function(){
      this.$store.state.username="";
      this.$store.state.token="";
      sessionStorage.removeItem("username");
      sessionStorage.removeItem("password");
      sessionStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("password");
      localStorage.removeItem("token");
      this.$router.push('/login/');
    },
    deckpage: function(){
      this.$router.push('/deck/');
    },
    submit: async function(){
      url="/api/decks/adddeck/"+this.$store.state.username+"/"+this.deckname+"/"+this.$store.state.token;
      a=await fetch(url,{method: 'PUT'});
      response=await a.json();
      if(response == 0){
        this.alreadyexist=false;
        this.$store.state.loggedout=true;
        this.$router.push('/login');
      }
      else if(response == 1){
        this.alreadyexist=false;
        this.$router.push('/deck/addcard/'+this.deckname+'/');


      }
      else if(response == 2){
        this.alreadyexist=true;
      }
    }
  },
  template: `<div><link rel="stylesheet" href="/static/decks.css">
    <div class="container p-3 mb-5 bg-dark justify-content-md-end" id="stl">
      <div class="d-grid gap-2 d-md-flex justify-content-md-end">
      <a class="btn btn-danger" role="button" v-on:click="signout">Signout</a>
      <a class="btn btn-secondary" role="button" v-on:click="deckpage">Deckpage</a><br>
      </div>
      <img src="/static/homepageicon.png" width="80" height="80" class="d-inline-block align-top" alt=""><br>
      <h3>Enter Deck Name</h3>
      <h4 style="color: #339933;">Under a deck you can add any number of cards</h4>
      <h4 style="color: #339933;">Choose a name for your deck to start adding cards</h4><br>
      <input type="text" v-model="deckname" class="form-control" id="user_name" name="deck_name" placeholder="Deck Name" style=" color: white; background-color:rgb(60, 60, 60); border: 0px solid black;" required><br>
      <h5 style="color:red;" v-if="alreadyexist">This Deckname is already used</h5>
      <br v-if="alreadyexist">
      <button class="btn btn-primary" v-on:click="submit">Submit</button><br><br>

    </div></div>`
}

const addcard = {
  data : function(){
    return{
      deckname:this.$route.params.deckname,
      cardname:"",
      cardremarks:"",
      alreadyexist:false,
    }
  },
  methods : {
    signout: function(){
      this.$store.state.username="";
      this.$store.state.token="";
      sessionStorage.removeItem("username");
      sessionStorage.removeItem("password");
      sessionStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("password");
      localStorage.removeItem("token");
      this.$router.push('/login/');
    },
    deckpage: function(){
      this.$router.push('/deck/');
    },
    cardpage: function(){
      this.$router.push('/deck/'+this.deckname+'/card/')
    },
    submit : async function(){
      url="/api/decks/addcard/add/"+this.$store.state.username+"/"+this.deckname+"/"+this.cardname+"/"+this.cardremarks+"/"+this.$store.state.token;
      a=await fetch(url,{method: 'PUT'});
      response=await a.json();
      if(response==0){
        this.alreadyexist=false;
        this.$store.state.loggedout=true;
        this.$router.push('/login');
      }
      else if(response==1){
        this.alreadyexist=false;
        this.$router.push('/deck/'+this.deckname+'/card/');
      }
      else if(response==2){
        this.alreadyexist=true;
      }
    }
  },
  template : `<div><link rel="stylesheet" href="/static/decks.css">
      <div class="container p-3 mb-5 bg-dark justify-content-md-end" id="stl">
      <div class="d-grid gap-2 d-md-flex justify-content-md-end">
      <a class="btn btn-danger" role="button" v-on:click="signout">Signout</a>
      <a class="btn btn-secondary" role="button" v-on:click="deckpage">Deckpage</a>
      <a class="btn btn-info" role="button" v-on:click="cardpage">Cardpage</a><br>
      </div>
      <img src="/static/homepageicon.png" width="80" height="80" class="d-inline-block align-top" alt=""><br>
      <label for="user_name" class="form-label"><h3>Enter Card Name</h3></label>
      <input type="text" v-model="cardname" class="form-control" id="user_name" name="card_name" placeholder="Card Name" style=" color: white; background-color:rgb(60, 60, 60); border: 0px solid black;" required><br>
      <label for="user_name" class="form-label"><h3>Enter Card Remarks</h3></label>
      <input type="text" v-model="cardremarks" class="form-control" id="user_name" name="card_remarks" placeholder="Card Remarks" style=" color: white; background-color:rgb(60, 60, 60); border: 0px solid black;" required><br>
      <h5 style="color:red;" v-if="alreadyexist">This Cardname is already used</h5>
      <br v-if="alreadyexist">
      <button class="btn btn-primary" v-on:click="submit">Submit</button><br><br>
      </div></div>`
}

const renamedeck = {
  data : function(){
    return {
      deckname:this.$route.params.deckname,
      newdeckname:"",
      alreadyexist:false,
    }
  },
  methods:{
    signout: function(){
      this.$store.state.username="";
      this.$store.state.token="";
      sessionStorage.removeItem("username");
      sessionStorage.removeItem("password");
      sessionStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("password");
      localStorage.removeItem("token");
      this.$router.push('/login/');
    },
    deckpage: function(){
      this.$router.push('/deck/');
    },
    submit : async function(){
      url="/api/decks/renamedeck/"+this.$store.state.username+"/"+this.deckname+"/"+this.newdeckname+"/"+this.$store.state.token;
      a=await fetch(url,{method: 'PUT'});
      response=await a.json();
      if(response==0){
        this.alreadyexist=false;
        this.$store.state.loggedout=true;
        this.$router.push('/login');
      }
      else if(response==1){
        this.alreadyexist=false;
        this.$router.push('/deck/');
      }
      else if(response==2){
        this.alreadyexist=true;
      }
    }
  },
  template: `<div><link rel="stylesheet" href="/static/decks.css">
    <div class="container p-3 mb-5 bg-dark justify-content-md-end" id="stl">
    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
    <a class="btn btn-danger" role="button" v-on:click="signout">Signout</a>
    <a class="btn btn-secondary" role="button" v-on:click="deckpage">Deckpage</a><br>
    </div>
    <img src="/static/homepageicon.png" width="80" height="80" class="d-inline-block align-top" alt=""><br>
    <label for="user_name" class="form-label"><h3>Enter New Deck Name</h3><h4 style="color: #339933;">Under a deck you can add any number of cards</h4><h4 style="color: #339933;">Choose a name for your deck to start adding cards</h4><br></label>
    <input type="text" v-model="newdeckname" class="form-control" id="user_name" name="newdeck_name" :placeholder="deckname" style=" color: white; background-color:rgb(60, 60, 60); border: 0px solid black;" required><br>
    <h5 style="color:red;" v-if="alreadyexist">This Deckname is already used</h5>
    <br v-if="alreadyexist">
    <button class="btn btn-primary" v-on:click="submit">Submit</button><br><br>
    </div>
    </div>`
}

const cardpage = {
  data : function(){
    return {
      deckname:this.$route.params.deckname,
      present:false,
      cardlist:[],
    }
  },
  methods:{
    signout: function(){
      this.$store.state.username="";
      this.$store.state.token="";
      sessionStorage.removeItem("username");
      sessionStorage.removeItem("password");
      sessionStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("password");
      localStorage.removeItem("token");
      this.$router.push('/login/');
    },
    deckpage: function(){
      this.$router.push('/deck/');
    },
    editcard: function(e){
      this.$router.push('/deck/'+this.deckname+'/card/editcard/'+this.cardlist[e].card_name+'/'+this.cardlist[e].card_remarks+'/');
    },
    deletecard: async function(e){
      username=this.$store.state.username;
      token=this.$store.state.token;
      deckname=this.$route.params.deckname;
      url="/api/decks/deletecard/"+username+"/"+deckname+"/"+this.cardlist[e].card_name+"/"+token;
      a=await fetch(url,{method: 'DELETE'});
      response=await a.json();
      console.log(response)
      if(response==0){
        this.$store.state.loggedout=true;
        this.$router.push('/login');
      }
      else if(response==1){
        this.cardlist.splice(e,1);
      }
    },
    addcard: function(){
      this.$router.push('/deck/addcard/'+this.deckname+'/');
    }
  },
  beforeCreate: async function(){
    username=this.$store.state.username;
    token=this.$store.state.token;
    deckname=this.$route.params.deckname;
    url="/api/decks/addcard/"+username+"/"+deckname+"/"+token;
    a=await fetch(url,{method: 'GET'});
    response=await a.json();
    if(response==0){
      this.$store.state.loggedout=true;
      this.$router.push('/login');
    }
    else if(response==1){
      this.present=false;
    }
    else{
      this.cardlist=response;
      this.present=true;
    }
  },
  template:`<div><link rel="stylesheet" href="/static/deckslist.css">
      <div class="container p-3 mb-5 bg-dark justify-content-md-end" id="stl">
        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
        <a class="btn btn-danger" role="button" v-on:click="signout">Signout</a>
        <a class="btn btn-secondary" role="button" v-on:click="deckpage">Deckpage</a><br>
        </div>
        <img src="/static/homepageicon.png" width="80" height="80" class="d-inline-block align-top" alt=""><br>
        <div><h1>Available Cards</h1></div><br>

        <div v-if="present">
        <div id="collapse1">
        <table class="table table-dark table-striped table-hover" style="border-radius:15px;">
            <tr>
            <th>S.No</th>
            <th>Card Name</th>
            <th>Remarks</th>
            <th>Edit Card</th>
            <th>Delete Card</th>
            </tr>
            
            <tr v-for="(card, index) in cardlist" :key="index">
            <td>{{index+1}}</td>
            <td>{{card.card_name}}</td>
            <td>{{card.card_remarks}}</td>
            <td><a class="btn btn-outline-primary btn-sm" role="button" v-on:click="editcard(index)">Edit</a></td>
            <td><a class="btn btn-outline-danger btn-sm" role="button" v-on:click="deletecard(index)">Delete</a></td>
            </tr>

        </table></div></div><br>
        <div v-if="!present">
          <h2>You don't have any Cards</h2><br>
          <h4><i style="color: #ff66ff">Want to Improve language skills<br>Increase the ability to compose stories<br>Memorizing, analyzing a problem<br> This is your one stop destination<br></i><div style="color: #009933"><br><h3>Don't Forget a Thing</h3></div> To add a new Card press the button below</h4>
        </div>
        <div><h4><a class="btn btn-success" role="button" v-on:click="addcard">Add a card</a></h4></div>
      </div></div>`
}

const editcard = {
  data: function(){
    return{
      deckname:this.$route.params.deckname,
      cardname:this.$route.params.cardname,
      cardremarks:this.$route.params.cardremarks,
      newcardname:"",
      newcardremarks:"",
    }
  },
  methods:{
    signout: function(){
      this.$store.state.username="";
      this.$store.state.token="";
      sessionStorage.removeItem("username");
      sessionStorage.removeItem("password");
      sessionStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("password");
      localStorage.removeItem("token");
      this.$router.push('/login/');
    },
    deckpage: function(){
      this.$router.push('/deck/');
    },
    cardpage: function(){
      this.$router.push('/deck/'+this.deckname+'/card/')
    },
    submit: async function(){
      username=this.$store.state.username;
      token=this.$store.state.token;
      deckname=this.$route.params.deckname;
      cardname=this.$route.params.cardname,
      url="/api/editcard/"+username+"/"+deckname+"/"+cardname+"/"+this.newcardname+"/"+this.newcardremarks+"/"+token;
      a=await fetch(url,{method: 'PUT'});
      response=await a.json();
      if(response==1){
        this.$router.push('/deck/'+deckname+'/card/');
      }
      else if(response==0){
        this.$store.state.loggedout=true;
        this.$router.push('/login');
      }
    }
  },
  template: `<div>
      <link rel="stylesheet" href="/static/decks.css">
      <div class="container p-3 mb-5 bg-dark justify-content-md-end" id="stl">
      <div class="d-grid gap-2 d-md-flex justify-content-md-end">
      <a class="btn btn-danger" role="button" v-on:click="signout">Signout</a>
      <a class="btn btn-secondary" role="button" v-on:click="deckpage">Deckpage</a>
      <a class="btn btn-info" role="button" v-on:click="cardpage">Cardpage</a><br>
      </div>
      <img src="/static/homepageicon.png" width="80" height="80" class="d-inline-block align-top" alt=""><br>

      <label for="user_name" class="form-label"><h3>Enter New Card Name</h3><br></label>
      <input type="text" v-model="newcardname" :placeholder="cardname" class="form-control" id="user_name" name="newcard_name" style=" color: white; background-color:rgb(60, 60, 60); border: 0px solid black;" required><br>
      <label for="user_name" class="form-label"><h3>Enter New Card Remarks</h3><br></label>
      <input type="text" v-model="newcardremarks" :placeholder="cardremarks" class="form-control" id="user_name" name="newcard_remarks" style=" color: white; background-color:rgb(60, 60, 60); border: 0px solid black;" required><br>
      <button class="btn btn-primary" v-on:click="submit">Submit</button><br><br>
      </form>
      </div>
    </div>`
}

const play = {
  data: function(){
    return {
      score:3,
      cardname:"",
      cardremarks:"",
      showans:false,
    }
  },
  methods:{
    signout: function(){
      this.$store.state.username="";
      this.$store.state.token="";
      sessionStorage.removeItem("username");
      sessionStorage.removeItem("password");
      sessionStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("password");
      localStorage.removeItem("token");
      this.$router.push('/login/');
    },
    deckpage: function(){
      this.$router.push('/deck/');
    },
    change: function(){
      this.showans=!this.showans;
    },
    submit: async function(){
      username=this.$store.state.username;
      token=this.$store.state.token;
      deckname=this.$route.params.deckname;
      score=this.score;
      url="/api/decks/play/addscore/"+username+"/"+deckname+"/"+score+"/"+token;
      a=await fetch(url,{method: 'PUT'});
      response=await a.json();
      this.score=3;
      this.showans=false;
      this.randomize();
    },
    randomize: async function(){
      username=this.$store.state.username;
      token=this.$store.state.token;
      deckname=this.$route.params.deckname;
      url="/api/decks/play/"+username+"/"+deckname+"/"+token;
      a=await fetch(url,{method: 'GET'});
      response=await a.json();
      if(response==0){
        this.$store.state.loggedout=true;
        this.$router.push('/login');
      }
      else if(response==1){
        this.$router.push('/deck/'+deckname+'/card/');
      }
      else{
        this.cardname=response[0];
        this.cardremarks=response[1];
      }
    }
  },
  beforeCreate: async function(){
    username=this.$store.state.username;
    token=this.$store.state.token;
    deckname=this.$route.params.deckname;
    url="/api/decks/play/"+username+"/"+deckname+"/"+token;
    a=await fetch(url,{method: 'GET'});
    response=await a.json();
    if(response==0){
      this.$store.state.loggedout=true;
      this.$router.push('/login');
    }
    else if(response==1){
        this.$router.push('/deck/'+deckname+'/card/');
    }
    else{
      this.cardname=response[0];
      this.cardremarks=response[1];
    }
  },
  template: `<div>
        <link rel="stylesheet" href="/static/play.css">
        <div class="container p-3 mb-5 bg-dark justify-content-md-end" id="stl">

      <div class="d-grid gap-2 d-md-flex justify-content-md-end">
      <a class="btn btn-danger" role="button" v-on:click="signout">Signout</a>
      <a class="btn btn-secondary" role="button" v-on:click="deckpage">Deckpage</a><br>
      </div>

      <div class="row">
      <div><img src="/static/homepageicon.png" width="80" height="80" class="d-inline-block align-top" alt=""><br><br><br></div><br>
      </div>

      <div class="row">&nbsp&nbsp&nbsp&nbsp&nbsp

      <div class="col">
        <div height="500" class="row container" style="background-color: #fc5304" id="stl1"><h4><br><br><br><br> <div v-if="!showans">{{cardname}}</div> 
        <div v-if="showans">{{cardname}}<br><br>{{cardremarks}}</div><br><br><br><br></h4><br>
        </div><br>
        <div class="row container"><a class="btn btn-success" role="button" v-on:click="change">Flip Card</a></div>
      </div>

      <div class="col">
        <div class="stl3">  
          
            <h5><br><br>Remembering this Card's Content is<br> 
              <div class="form-check">
                <input class="form-check-input" type="radio" name="Radio" id="Radios1" value="5" v-model="score" checked>
                <label class="form-check-label" for="Radios1">
                  Easy
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" name="Radio" id="Radios2" value="3" v-model="score">
                <label class="form-check-label" for="Radios2">
                  Medium
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" name="Radio" id="Radios3" value="1" v-model="score">
                <label class="form-check-label" for="Radios3">
                  Difficult
                </label><br><br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
                <button class="btn btn-primary" id="stl4" v-on:click="submit">Submit & Go</button><br><br>
              </div>
            </h5>
          
        </div>
      </div>
      </div>
      </div>
      </div>`
}

const importcsv = {
  delimiters: ['${', '}'],
  data : function(){
    return {
      alreadyexist:false,
      loading:false,
    }
  },
  methods: {
    submit: async function(){
      this.loading=true;
      this.alreadyexist=false;
      username=this.$store.state.username;
      token=this.$store.state.token;
      var input = document.getElementById('fileupload');
      const data = new FormData();
      data.append('impfile', input.files[0]);
      a= await fetch('/api/decks/importcsv/'+username+'/'+token, {
        method: 'PUT',
        body: data
      })
      response=await a.json();
      if(response == 0){
        this.alreadyexist=false;
        this.$store.state.loggedout=true;
        this.loading=false;
        this.$router.push('/login');
      }
      else if(response == 2){
        this.loading=false;
        this.alreadyexist=true;
      }
      else if(response == 1){
        this.loading=false;
        this.alreadyexist=false;
        this.$router.push('/deck/')
      }
    },
    signout: function(){
      this.$store.state.username="";
      this.$store.state.token="";
      sessionStorage.removeItem("username");
      sessionStorage.removeItem("password");
      sessionStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("password");
      localStorage.removeItem("token");
      this.$router.push('/login/');
    },
    deckpage: function(){
      this.$router.push('/deck/');
    },
  },
  template: `<div><link rel="stylesheet" href="/static/deckslist.css">
    <div class="container p-3 mb-5 bg-dark justify-content-md-end" id="stl">
    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
    <a class="btn btn-danger" role="button" v-on:click="signout">Signout</a>
    <a class="btn btn-secondary" role="button" v-on:click="deckpage">Deckpage</a><br>
    </div>
    <img src="/static/homepageicon.png" width="80" height="80" class="d-inline-block align-top" alt=""><br>
    <h2>You can add Deck using CSV file</h2><br>
    <div class="input-group">
    <input type="file" accept=".csv" class="form-control" id="fileupload" name="filecsv" aria-describedby="inputGroupFileAddon04" aria-label="Upload" required>
    </div>
    <br>
    <div v-if="alreadyexist"><h5 style="color:red;">The Deckname provided in the File is already been used</h5></div>
    <br v-if="alreadyexist">
    <button class="btn btn-primary" v-on:click="submit">Submit</button><br><br>
    <div v-if="loading" class="spinner-border text-warning" style="width: 3rem; height: 3rem;" role="status">
    <span class="visually-hidden">Loading...</span>
    </div><br>
    <h5><div style="color:#009933; text-align:left;"><h4>&nbspInstructions:</h4>
    <ul><li>The file type should be CSV</li>
    <li>The fisrt line of the CSV file should be the Deck name</li>
    <li>The following lines should be the cards data</li>
    <li>The format of a card data is (card_name, card_remarks)</li></ul></div></h5>
    </div></div>`
}

const routes = [
{ path: '/', name: 'home', component: homepage },
{ path: '/login/', name: 'login', component: loginpage },
{ path: '/signup/', name: 'signup', component: signuppage },
{ path: '/deck/', name: 'deck', component: deckpage },
{ path: '/deck/adddeck', name: 'adddeck', component: adddeck },
{ path: '/deck/addcard/:deckname', name: 'addcard', component: addcard },
{ path: '/deck/rename/:deckname', name: 'renamedeck', component: renamedeck },
{ path: '/deck/:deckname/card/', name: 'card', component: cardpage },
{ path: '/deck/:deckname/card/editcard/:cardname/:cardremarks/', name: 'editcard', component: editcard },
{ path: '/deck/:deckname/play/', name: 'play', component: play },
{ path: '/deck/importcsv', name: 'importcsv', component: importcsv },
]

const router = new VueRouter({
routes,
base: '/',
})

let app = new Vue({
    el: '#app',
    delimiters: ['${', '}'],
    data: {
      token:"",
      username:"",
      successcreation:false,
    },
    router,
    store,
    methods: {
      
    },
  })