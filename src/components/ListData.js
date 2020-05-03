import React, { PureComponent } from 'react'
import { connect } from 'react-redux';

import { Card, CardContent, Typography, Select, MenuItem, InputBase, AppBar, Toolbar, debounce } from '@material-ui/core'
import Pagination from '@material-ui/lab/Pagination'
import Rating from '@material-ui/lab/Rating'

import './listData.css'
import { List } from 'immutable';

class ListData extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            pageNumber: 0,
            listData: new List(),
            sortField: undefined,
            sortOrder: undefined,
            searchField: undefined,
            searchQuery: undefined,
            initData: undefined
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ listData: nextProps.listData, initData: nextProps.listData })
    }

    updatePageNumber = (event, pageNo) => {
        this.setState({ pageNumber: pageNo - 1 })
    }

    sortFieldData = (criteria) => {
        let conditions = { ...this.state.conditions, ...criteria }
        let data = this.state.listData
        
        let sortedData = data
        if (conditions.sortField) {
            sortedData = data.sort(
                (item1, item2) => {
                    let compareValue;
                    if (conditions.sortOrder)
                        compareValue = item1[conditions.sortField] - item2[conditions.sortField];
                    else
                        compareValue = item2[conditions.sortField] - item1[conditions.sortField];

                    console.log(item1[conditions.sortField]);
                    return compareValue;
                }
            );
        }

        this.setState({ conditions, listData: sortedData })

    }

    filterListData = (criteria) => {
        let conditions = { ...this.state.conditions, ...criteria }
        let data = this.state.initData
        let { searchQuery } = conditions
        if (searchQuery) {
            data = data.filter((item) => {
                if (item["Restaurant_Name"] && (item["Restaurant_Name"].toLowerCase().includes(searchQuery.toLowerCase())
                    || item["Cuisines"].toLowerCase().includes(searchQuery.toLowerCase()))) {
                    return true;
                } else {
                    return false;
                }
            })
        } else {
            data = this.state.initData
        }

        this.setState({ conditions, listData: data })

    }

    render() {
        let { pageNumber, listData } = this.state
        let totalCount = Math.ceil(listData.size / 10);
        if (pageNumber > totalCount) {
            pageNumber = 0
            this.state.pageNumber = pageNumber
        }
        let startPage = pageNumber * 10
        let pagedData = listData.slice(startPage, startPage + 10);
        return (
            <>
                <AppBar position="static">
                    <Toolbar>
                        <div className="search-bar">
                            <SortingField sortFieldData={this.sortFieldData} />
                            <SearchField filterListData={this.filterListData} />
                        </div>
                    </Toolbar>
                </AppBar>
                <div className="container">
                    <div className="row col-12">
                        {
                            pagedData.map((restaurantData) => {
                                return <Card className="m-3 col-sm-5 col-12">
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {restaurantData.Restaurant_Name}
                                        </Typography>
                                        <Typography gutterBottom variant="body2" color="textSecondary" component="p">
                                            Cuisines : {restaurantData.Cuisines}
                                        </Typography>
                                        <Typography gutterBottom variant="body2" color="textSecondary" component="p">
                                            Cost For two : {restaurantData.Average_Cost_for_two} ₹
                                    </Typography>
                                        <Typography gutterBottom variant="body2" color="textSecondary" component="p">
                                            Score :
                                        <Rating name="restaurant-score" readOnly precision={0.2} value={restaurantData.rating} max={5} size="small" />
                                        </Typography>
                                        <Typography gutterBottom variant="body2" color="textSecondary" component="p">
                                            No of Votes : {restaurantData.Votes}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            })
                        }
                    </div>
                    <Pagination className="p-3 center-flex" count={totalCount} page={pageNumber + 1} onChange={this.updatePageNumber} />
                </div>
            </>
        );
    }
}

let SearchField = ({ filterListData }) => {
    let onUserInput = (event) => {
        let eventValue = event.target.value;
        (debounce(() => {
            let condition = {
                searchQuery: eventValue
            }
            filterListData(condition)
        }, 1000))();
    }
    return (
        <div className="ml-3 searchContiner col-sm-3 col-6">
            <InputBase fullWidth={true}
                placeholder="enter restaurant name or cuisine"
                inputProps={{ 'aria-label': 'search' }}
                onChange={onUserInput}
            />
        </div>
    )
}

let sortFieldMapping = {
    "10": {
        sortBy: 'rating',
        sortOrder: true
    },
    "20": {
        sortBy: 'rating',
        sortOrder: false
    },
    "30": {
        sortBy: "Average_Cost_for_two",
        sortOrder: true
    },
    "40": {
        sortBy: "Average_Cost_for_two",
        sortOrder: false
    },
    "50": {
        sortBy: "Votes",
        sortOrder: true
    },
    "60": {
        sortBy: "Votes",
        sortOrder: false
    }
}

let SortingField = ({ sortFieldData }) => {
    const [selectedKey, setSelected] = React.useState(-1);

    const handleChange = (event) => {
        setSelected(event.target.value);
        let sortCondition = sortFieldMapping[event.target.value];
        let condition = {
            sortField: sortCondition.sortBy,
            sortOrder: sortCondition.sortOrder
        }
        sortFieldData(condition)
    };
    return (
        <Select className="searchContiner pl-3 col-sm-3 col-6"
            value={selectedKey}
            onChange={handleChange}
        >
            <MenuItem value={-1} disabled>Sort By...</MenuItem>
            <MenuItem value={10}>SortBy Rating Asc</MenuItem>
            <MenuItem value={20}>SortBy Rating Desc</MenuItem>
            <MenuItem value={30}>Sort by Avg Cost For two Asc</MenuItem>
            <MenuItem value={40}>Sort by Avg Cost For two Desc</MenuItem>
            <MenuItem value={50}>Sort by Votes Asc</MenuItem>
            <MenuItem value={60}>Sort by Votes Desc</MenuItem>
        </Select >
    )
}

const mapStateToProps = ({ listData }) => {
    return { listData };
}

export default connect(mapStateToProps, null)(ListData);