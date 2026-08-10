import ModernTemplate from "./templates/ModernTemplate";

const PortfolioPreview = ({ portfolio }) => {
    if (!portfolio) return null;

    return <ModernTemplate portfolio={portfolio} />;
};

export default PortfolioPreview;