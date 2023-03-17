import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Checkbox,
    Container,
    Heading,
    HStack,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useDisclosure,
    useToast
} from "@chakra-ui/react";
import { ChevronDownIcon, PlusSquareIcon } from "@chakra-ui/icons";
import React, {useEffect, useMemo, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { FilterDialog } from "@/components/filterDialog";
import {deleteMeeting, getMeetings} from "@/services/meetings.service";
import { meetingLists, setLoading, setMeetings } from "@/store/common";
import moment from "moment/moment";

export default function Home() {
    const router = useRouter();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const rowsPerPage = 5;
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [checkAll, setCheckAll] = useState(false);
    const toast = useToast();
    const dispatch = useDispatch();
    const lists = useSelector(meetingLists);

    const nextPage = () => {
        if (page >= lists.length / rowsPerPage - 1) {
            return
        }
        setPage(page + 1);
    }

    const prevPage = () => {
        if (page < 1) {
            return
        }
        setPage(page - 1);
    }

    const filterData = useMemo(() => {
        return lists.length > 0 ? lists.filter((row) => row.title.toLocaleLowerCase().includes(search.toLocaleLowerCase())) : [];
    }, [search, lists]);

    const handleClose = () => {
        onClose();
        setSearch('');
    };

    const gotoDetail = (id) => {
        router.push(`/${id}`);
    };

    const handleCheckRow = (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        const allIds = filterData.map((item) => item.id);

        let ids=[];

        if (e.target.checked) {
            ids = [
                ...selectedRows,
                id
            ];
            if (allIds.every((id) => ids.includes(id)) && ids.every((id) => allIds.includes(id))) {
                setCheckAll(true);
            }
        } else {
            setCheckAll(false)
            ids = selectedRows.filter((_) => _ !== id)
        }

        setSelectedRows(ids);
    };

    const handleAllCheckRow = (e) => {
        setCheckAll(e.target.checked);
        const ids = filterData.map((item) => item.id);
        if (e.target.checked) {
            setSelectedRows(ids);
        } else {
            setSelectedRows([]);
        }
    };

    const handleDelete = () => {
        if (selectedRows.length === 0) {
            toast({
                title: 'Warning.',
                description: "Please select any row to remove",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
            return;
        }
        dispatch(setLoading(true));
        deleteMeeting(selectedRows).then((res) => {
            if (res.data) {
                dispatch(setMeetings(lists.filter((item) => !selectedRows.includes(item.id))));
            }
        }).finally(() => {
            dispatch(setLoading(false));
        })
    };

    const getLists = (id) => {
        dispatch(setLoading(true));
        getMeetings(id).then((res) => {
            if (res && res.data)
                dispatch(setMeetings(res?.data));
        }).finally(() => {
            dispatch(setLoading(false));
        })
    }

    useEffect(() => {
        getLists();
    }, []);

    return (
        <Container maxW="container.2xl" centerContent sx={{ mt: '6rem' }}>
            <Heading mb={4}>Meetings</Heading>
            <Card w="100%">
                <CardHeader display="flex" justifyContent="space-between">
                    <HStack>
                        <Button leftIcon={<PlusSquareIcon />} mr={2} size="sm" onClick={onOpen}>
                            Filter
                        </Button>
                        <Menu>
                            <MenuButton as={Button} size="sm" rightIcon={<ChevronDownIcon />}>
                                Actions
                            </MenuButton>
                            <MenuList>
                                <MenuItem onClick={handleDelete}>Delete</MenuItem>
                            </MenuList>
                        </Menu>
                    </HStack>
                </CardHeader>
                <CardBody>
                    <TableContainer>
                        <Table>
                            <Thead>
                                <Tr>
                                    <Th><Checkbox isChecked={checkAll} onChange={handleAllCheckRow} /></Th>
                                    <Th>TITLE</Th>
                                    <Th>START TIME</Th>
                                    <Th>ACCOUNT</Th>
                                    <Th>BODY</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {filterData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                    <Tr cursor="pointer" key={`tbody-row-${index}`}>
                                        <Td><Checkbox isChecked={selectedRows.indexOf(row.id) > -1} onChange={(e) => handleCheckRow(e, row.id)} /></Td>
                                        <Td>
                                            <Text onClick={() => gotoDetail(row.id)} color='blue'>{row.title}</Text>
                                        </Td>
                                        <Td>{moment(row.startTime).format('YYYY-MM-DD HH:mm:ss')}</Td>
                                        <Td>
                                            {row.account}
                                        </Td>
                                        <Td>
                                            {row.body.replace(/(<([^>]+)>)/ig, '')}
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </CardBody>
                <CardFooter display="flex" justify="space-between" alignItems="center">
                    <Text>Showing {filterData.length ? page * rowsPerPage + 1 : 0} to {page * rowsPerPage + rowsPerPage < filterData.length ? page * rowsPerPage + rowsPerPage : filterData.length} of {filterData.length} results</Text>
                    <HStack>
                        <Button colorScheme="blue" mr={4} onClick={prevPage} isDisabled={page === 0}>
                            Previous
                        </Button>
                        <Button colorScheme="blue" onClick={nextPage} isDisabled={page * rowsPerPage + rowsPerPage >= filterData.length}>
                            Next
                        </Button>
                    </HStack>
                </CardFooter>
            </Card>

            <FilterDialog isOpen={isOpen} onClose={handleClose} handleSearch={setSearch} />
        </Container>
    )
}
