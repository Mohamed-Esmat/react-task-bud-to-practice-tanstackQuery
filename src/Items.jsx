import SingleItem from "./SingleItem";
import { useFetchTasks } from "./reactQueryCustomHooks";
const Items = () => {
  const { data, error, isError, isLoading } = useFetchTasks();
  if (isLoading) {
    return <p style={{ marginTop: "1rem", textAlign: "center" }}>Loading...</p>;
  }

  if (isError) {
    return (
      <p style={{ marginTop: "1rem", textAlign: "center" }}>
        There was an error...
      </p>
    );
  }

  // if (error) {
  //   return (
  //     <p style={{ marginTop: "1rem", textAlign: "center" }}>
  //       {error.response.data || "There was an error..."}
  //     </p>
  //   );
  // }

  return (
    <div className="items">
      {data.taskList.map((item) => {
        return <SingleItem key={item.id} item={item} />;
      })}
    </div>
  );
};
export default Items;
