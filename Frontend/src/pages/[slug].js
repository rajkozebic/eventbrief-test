import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { setLoading } from "@/store/common";
import { getMeetingById, updateMeeting } from "@/services/meetings.service";
import moment from "moment";

export default function MeetingDetail() {
  const router = useRouter();
  const dispatch = useDispatch();
  const meetingId = router.query.slug;
  const [meetingInfo, setMeetingInfo] = useState(null);

  const getMeeting = (id) => {
    dispatch(setLoading(true));
    getMeetingById(id)
      .then((res) => {
        if (res && res.data) setMeetingInfo(res.data);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  useEffect(() => {
    getMeeting(meetingId);
  }, [meetingId]);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    account: Yup.string().required("Account is required"),
    startTime: Yup.string().required("Start Time is required"),
    nextSteps: Yup.string().required("Next step is required"),
  });

  const initialValues = {
    title: meetingInfo?.title ? meetingInfo?.title : "",
    account: meetingInfo?.account ? meetingInfo?.account : "",
    startTime: meetingInfo?.startTime
      ? moment(meetingInfo?.startTime).format("YYYY-MM-DD HH:mm:ss")
      : "",
    nextSteps: meetingInfo?.body
      ? meetingInfo?.body.replace(/(<([^>]+)>)/gi, "")
      : "",
  };

  const handleSubmit = (values) => {
    dispatch(setLoading(true));
    updateMeeting(meetingId, values)
      .then((res) => {
        if (res && res.data) setMeetingInfo(res.data);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  return (
    <Container maxW="container.2xl" sx={{ mt: "6rem" }}>
      <Breadcrumb display="flex" justifyContent="start">
        <BreadcrumbItem>
          <BreadcrumbLink href="/">
            <ChevronLeftIcon /> Back
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Heading mb={4} textAlign="center">
        Meeting Detail
      </Heading>
      <HStack display="flex" justifyContent="center">
        <Card width="lg" my={3}>
          <CardHeader>
            <Heading size="md">Edit Form</Heading>
          </CardHeader>
          <CardBody>
            <Formik
              enableReinitialize={true}
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({
                handleSubmit,
                handleBlur,
                handleChange,
                errors,
                touched,
                values,
              }) => (
                <Form onSubmit={handleSubmit}>
                  <FormControl mb={2} isInvalid={errors.title && touched.title}>
                    <FormLabel>Title</FormLabel>
                    <Input
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="title"
                      type="text"
                      value={values.title}
                    />
                    {errors.title && touched.title && (
                      <FormErrorMessage>{errors.title}</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl
                    mb={2}
                    isInvalid={errors.account && touched.account}
                  >
                    <FormLabel>Account</FormLabel>
                    <Input
                      readOnly
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="account"
                      type="text"
                      value={values.account}
                    />
                    {errors.account && touched.account && (
                      <FormErrorMessage>{errors.account}</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl
                    mb={2}
                    isInvalid={errors.startTime && touched.startTime}
                  >
                    <FormLabel>Start Time</FormLabel>
                    <Input
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="startTime"
                      type="text"
                      value={values.startTime}
                    />
                    {errors.startTime && touched.startTime && (
                      <FormErrorMessage>{errors.startTime}</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl
                    mb={2}
                    isInvalid={errors.nextSteps && touched.nextSteps}
                  >
                    <FormLabel>Next Steps</FormLabel>
                    <Textarea
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="nextSteps"
                      value={values.nextSteps}
                      resize="none"
                      rows={5}
                    />
                    {errors.nextSteps && touched.nextSteps && (
                      <FormErrorMessage>{errors.nextSteps}</FormErrorMessage>
                    )}
                  </FormControl>
                  <Button type="submit">Submit</Button>
                </Form>
              )}
            </Formik>
          </CardBody>
        </Card>
      </HStack>
    </Container>
  );
}

MeetingDetail.getInitialProps = async () => {
  return {};
};
