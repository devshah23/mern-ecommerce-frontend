import { Flex, Spin } from "antd";

const Loader = () => {
  return (
    <Flex
      align="center"
      gap="middle"
      style={{ height: "100vh" }}
      justify="center">
      <Spin size="large" />
    </Flex>
  );
};
interface SkeletonProps {
  width?: string;
  length?: number;
}

export const Skeleton = ({ width = "unset", length = 3 }: SkeletonProps) => {
  const skeletions = Array.from({ length }, (_, idx) => (
    <div key={idx} className="skeleton-shape"></div>
  ));

  return (
    <div className="skeleton-loader" style={{ width }}>
      {skeletions}
    </div>
  );
};
export default Loader;
