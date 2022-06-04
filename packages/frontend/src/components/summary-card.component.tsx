interface SummaryCardProps {
  title: string;
  content: string;
}

export default function SummaryCard({ title, content }: SummaryCardProps): JSX.Element {
  return (
    <div className="card w-96 bg-base-300 shadow-xl mr-0 mb-5 md:mr-5 md:mb-0">
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p className="text-lg" data-testid="temperature-summary-card-value">
          {content}
        </p>
      </div>
    </div>
  );
}
