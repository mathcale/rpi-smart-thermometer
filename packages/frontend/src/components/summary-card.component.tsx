interface SummaryCardProps {
  title: string;
  content: string;
  testId: string;
}

export default function SummaryCard({ title, content, testId }: SummaryCardProps): JSX.Element {
  return (
    <div className="card w-96 bg-base-300 shadow-xl mr-0 mb-5 md:mr-5 md:mb-0">
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p className="text-lg" data-testid={testId}>
          {content}
        </p>
      </div>
    </div>
  );
}
