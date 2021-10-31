import React, {Component} from 'react';
import {arrayMove ,SortableContainer, SortableElement} from 'react-sortable-hoc';
import {withTranslation} from "react-i18next";
import {deleteRule} from "../api/api";



class DragTest extends Component {
    constructor(props){
        super(props);
    }

    onSortEnd = ({oldIndex, newIndex}) => {
        this.setState(({items}) => ({
            items: arrayMove(items, oldIndex, newIndex),
        }));
    };

    handleDelete=(event)=>{
        deleteRule(event.target.id)
            .then(() =>{
                this.props.context.update();
            })
            .catch(() => this.setState({ error: this.props.t("genericError") }));
    }

    render() {
        const taxRules= this.props.taxRules;

        const SortableItem = SortableElement(({id,value}) => {
            return (
                <li className="list-group-item d-flex justify-content-between align-items-start">
                    <div className="ms-2 me-auto" id={id}>
                        <a href={"/rule/edit/"+id}>{value}</a>
                    </div>
                    <i className="fas fa-trash-alt " id={id} onClick={this.handleDelete}></i>

                </li>

            )});

        const SortableList = SortableContainer(({items}) => {
            return (
                <ol className="list-group">
                    {items.map(({id,name}) => (
                        <SortableItem key={`item-${id}`} index={id} id={id} value={name} />
                    ))}
                </ol>

            );
        });

        return (
            <SortableList items={taxRules.map(i=>({id:i.id,name:i.name}))}  distance={1}>

            </SortableList>
        );
    }
}

export default withTranslation()(DragTest);