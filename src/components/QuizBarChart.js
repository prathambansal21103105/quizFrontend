import "./QuizBarChart.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";

const QuizBarChart = ({ responses }) => {
  const chartData = responses.map((r) => ({
    title: r.title,
    percentage: ((r.score / r.maxMarks) * 100).toFixed(2),
  }));

  return (
    <div className="quiz-bar-chart">
      <h2>Performance Graph</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 10, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="title" angle={-20} textAnchor="end">
            <Label value="Quiz Title" offset={-25} position="insideBottom" />
          </XAxis>
          <YAxis domain={[0, 100]} tickFormatter={(val) => `${val}%`}>
            <Label value="Score (%)" angle={-90} position="insideLeft" />
          </YAxis>
          <Tooltip formatter={(value) => `${value}%`} />
          <Bar dataKey="percentage" fill="#4a90e2" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default QuizBarChart;
