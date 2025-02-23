const Container = ({ children }: { children: React.ReactNode }) => {
    return (
        <div role="tabpanel" className="tab-content p-5 border-base-200">
            {children}
        </div>
    );
}

export default Container;