import React, { Component } from 'react';
import './index.scss';

class Convo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            generateAnswer: [],
            time: 1,
            opacity: 1,
            convo: [],
            typedAnswer: [],

        }
        this.answers = ["wolf", "bug", "dog", "cat", "fur", "cotton", "fabric", "web", "spider", "fox", "rubber", "mouse", "flower", "polar bear", "vase", "plant", "mint", "daisy", "mouse", "glass", "cosmos", "space", "blanket", "monkey", "otter", "goose", "lion", "bird", "peacock", "sky", "ceramic", "cotton", "linen"];
        this.hintAnswer_animal = ["poodle", "alphaca", "lama", "snake", "spider", "cat", "parrot", "jellyfish", "otter", "frog", "bee", "butterfly", "shark", "turtle", "tiger", "bear", "deer", "mouse", "hamster"];
        this.hintAnswer_object = ["acorn", "plum", "bottle", "balloon", "confetti", "toaster", "camera", "socks", "strawberry", "castle", "train", "soccer ball", "vacuum", "spoon", "desk", "bed", "corn", "pumpkin", "candy"]
        this.convo = [];
        this.answer = this.props.answer;
        this.score = this.props.score;
    }
    componentDidMount() {
        if (this.props.typemode === 0) {
            this.setState({ opacity: 1 })
        }
        this.convoGenerate()
    }
    componentWillUnmount() {
        this.props.saveAnswers(this.state.typedElement, this.state.generateAnswer);
        clearInterval(this.convo);
    }
    rightAnswer(n, i) {
        clearInterval(this.convo);
        this.props.clearTimer();
        this.score[n][1] += 10;
        this.score[this.props.entireRound - 1][1] += 10;
        if(i){
            this.score[i][1] += 10;
            this.score[this.props.entireRound - 1][1] += 5;
        }
        this.props.setScore(this.score);
        this.setState({ disable: true, inputOpcity: .5 }); 
        window.setTimeout(function () { this.props.changeMode(4); }.bind(this), 300);
    }
    convoGenerate() {
        let answer;
        if (this.props.hintMode === true) {
            if (this.hintAnswer_animal.includes(this.props.answer.classLabels[0])) {
                answer = this.hintAnswer_animal;
            } else {
                answer = this.hintAnswer_object;
            }
        } else {
            answer = this.answers;
        }
        let answers, player, element;
        //make player num random if it's the first round
        switch (this.props.entireRound) {
            case 2: player = 2; break;
            case 3: player = 1; break;
            default:
        }
        //make the loading bubble animation opaque
        this.setState({ opacity: 1 });

        this.convo = setInterval(function () {
            if (this.state.time > 4) {
                this.setState({ opacity: 0 });
                let element = this.state.convo;
                element.push(this.state.generateAnswer);
                this.setState({ convo: element });
            }
            if(this.props.entireRound === 1){
                 player = (Math.floor(Math.random() * 2)) + 1 ;
                }
            answers = answer[Math.floor(Math.random() * answer.length)]
            element = this.state.generateAnswer;

            element.push(<div key={"convoWarp" + element.length}>
                <div className="convoWrap" key={"convo" + element.length}>
                    <div className={"bubble plyr" + (player + 1)} key={"convoBubble" + element.length}>
                        {answers}
                    </div>
                    <div className={"profile plyr" + (player + 1)} key={"profile" + element.length}>
                        <i className={this.props.players[player]}></i>
                    </div>
                </div>
            </div>);
            if(this.answer.classLabels.includes(answer)){this.rightAnswer(player)}
            this.setState({ generateAnswer: element, time: (this.state.time * 1) + 1 });
            this.autoScroll()
        }.bind(this), 4000)
    }
    //if player 1 types answer  
    addAnswer() {
        let tanswer = document.getElementById("answerType");
        let answers = [tanswer.value];
        if (this.answer.classLabels.includes(tanswer.value)) {
            this.rightAnswer(0)
        }
        let element = this.state.generateAnswer;
        let typedElement = this.state.typedAnswer;
        typedElement.push(answers);
        element.push(<div>
            <div className="convoWrap" key={"convo" + element.length}>
                <div className="bubble plyr1" key={"convoBubble" + element.length}>
                    {answers}
                </div>
                <div className="profile plyr1" key={"profile" + element.length}>
                    <i className={this.props.players[0]}></i>
                </div>
            </div>
        </div>);
        this.setState({ generateAnswer: element, typedAnswer: typedElement, time: (this.state.time * 1) + 1 });
        tanswer.value = "";
        window.setTimeout((ev) => { this.autoScroll() }, 10);
    }
    autoScroll() {
        let convoBox = document.getElementsByClassName("convo_inner")[0];
        if (convoBox) {
            convoBox.scrollTop = convoBox.scrollHeight - convoBox.clientHeight;
        }
    }
    renderInputBox() {
        if (this.props.typemode === 0) {
            return <div className="typing">
                <div className="bubble all">
                    <div className="dot" />
                    <div className="dot" />
                    <div className="dot" />
                </div>
                <div className='profileWrap'>
                    <div className="profile player3">
                        <i className={this.props.players[2]}></i>
                    </div>
                    <div className="profile player2">
                        <i className={this.props.players[1]}></i>
                    </div>
                </div>
            </div>
        } else {
            return <div id="tAnsrWrap">
                <input type="text" id="answerType" style={{ opacity: this.state.inputOpcity }} disabled={this.state.disable} autoFocus onKeyPress={(ev) => {
                    if (ev.key === "Enter") { this.addAnswer() }
                }} />
                <div className="submit btn" onClick={this.addAnswer.bind(this)} style={{ opacity: this.state.inputOpcity }}>
                    Enter
                </div>
            </div>
        }
    }
    render() {
        return (
            <div>
                <div className="convo_inner">
                    {this.state.generateAnswer}
                </div>
                {this.renderInputBox()}
            </div>
        )

    }
}

export default Convo;
