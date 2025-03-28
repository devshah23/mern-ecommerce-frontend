import { Flex, Typography } from "antd";
const { Title } = Typography;
const NotFound = () => {
  return (
    <Flex
      style={{
        height: "100%",
        paddingTop: "80px",
        justifyContent: "center",
        alignItems: "center",
      }}>
      <Title level={2}>Page Not Found</Title>
    </Flex>
  );
};

export default NotFound;
