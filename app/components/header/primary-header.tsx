interface Props {
    title: string
}

const PrimaryHeader = ({ title }: Props) => {
    return (
        <div className="w-full text-theme_topic text-2xl font-semibold"> 
            {title.toUpperCase()} 
        </div>
    )
}

export default PrimaryHeader;