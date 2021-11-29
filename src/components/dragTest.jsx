import {React,Component} from 'react';
import {arrayMove ,SortableContainer, SortableElement} from 'react-sortable-hoc';
import {withTranslation} from "react-i18next";
import {putRuleOrderChange} from "../api/api";

class DragTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            taxId:0,
            taxRules: [],
        };
    }

    componentDidMount() {
        this.updateState(this.props);
    }

    updateState(props){
        this.setState({
            taxRules: props.taxRules.map(i=>({id:i.id,name:i.name,priority:i.priority})),
            taxId:    props.taxId
        });
    }

    componentWillReceiveProps(newProps) {
        this.updateState(newProps);
    }

    onSortEnd = ({oldIndex, newIndex}) => {
        putRuleOrderChange(this.state.taxId,
                            {ruleIdFrom: this.state.taxRules[oldIndex].id,
                                   ruleIdTo:this.state.taxRules[newIndex].id})
            .then(result=>{
                console.log(result);
                this.setState(
                    ({taxRules}) => ({taxRules: arrayMove(taxRules, oldIndex, newIndex)})
                );
            })
            .catch(() => this.setState({ error: this.props.t("genericError") }));
    };

    render() {

        const {basePath} = this.props;

        const SortableItem = SortableElement(({id,value,order}) => {
            return (

                <li className="list-group-item d-flex justify-content-between align-items-start">
                    <div className="ms-2 me-auto" id={id}>
                        <a href={basePath+id}><span>{order+1}. </span>{value}</a>
                    </div>
                    <i className="fas fa-trash-alt " id={id} onClick={this.props.onDelete}></i>

                </li>

            )});

        const SortableList = SortableContainer(({items}) => {
            return (
                <ol className="list-group">
                    {items.map(({id,name},idx) => (
                        <SortableItem key={`item-${id}`} index={idx}  order={idx} id={id} value={name}/>
                    ))}
                </ol>
            );
        });

        return (
            <SortableList items={this.state.taxRules}  distance={1} onSortEnd={this.onSortEnd} />
        );
    }
}

export default withTranslation()(DragTest);