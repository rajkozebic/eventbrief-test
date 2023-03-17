import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogCloseButton,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    FormControl,
    Input,
} from "@chakra-ui/react";
import React from "react";

export function FilterDialog({ isOpen, onClose, handleSearch }) {
    const cancelRef = React.useRef()

    return (
        <AlertDialog
            motionPreset='slideInBottom'
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            isOpen={isOpen}
            isCentered
        >
            <AlertDialogOverlay />

            <AlertDialogContent>
                <AlertDialogHeader>Filter</AlertDialogHeader>
                <AlertDialogCloseButton />
                <AlertDialogBody>
                    <FormControl>
                        <Input type='text' onChange={(e) => handleSearch(e.target.value)} />
                    </FormControl>
                </AlertDialogBody>
                <AlertDialogFooter>
                    <Button colorScheme='red' ref={cancelRef} onClick={onClose}>
                        No
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}