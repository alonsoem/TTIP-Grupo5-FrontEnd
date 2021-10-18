import React, {Component} from 'react';
import {arrayMove ,SortableContainer, SortableElement} from 'react-sortable-hoc';
import {withTranslation} from "react-i18next";
import ListGroup from "react-bootstrap/ListGroup";


class DragTest extends Component {
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    onSortEnd = ({oldIndex, newIndex}) => {
        this.setState(({items}) => ({
            items: arrayMove(items, oldIndex, newIndex),
        }));

    };


    handleClick(e){
        this.props.context.props.history.push('/rule/edit/'+e.target.id);
    }


    render() {
        const taxRules= this.props.taxRules;

        const SortableItem = SortableElement(({id,value}) => {
            return (<ListGroup.Item onClick={this.handleClick} id={id}>{value}</ListGroup.Item>)
        });

        const SortableList = SortableContainer(({items}) => {
            return (
                <ListGroup defaultActiveKey="#link1" >
                    {items.map(({id,name}) => (
                        <SortableItem key={`item-${id}`} index={id} id={id} value={name}  />
                    ))}
                </ListGroup>
            );
        });

        return (
            <SortableList items={taxRules.map(i=>({id:i.id,name:i.name}))} onSortEnd={this.onSortEnd} distance={1}>

            </SortableList>
        );
    }
}

export default withTranslation()(DragTest);