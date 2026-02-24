import PageWrapper from "../components/Common/PageWrapper";
import UploadBill from "../components/Upload/UploadBill";

export default function UploadPage() {
  return (
    <PageWrapper>
      <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Upload Bill Image
        </h2>

        <UploadBill />
      </div>
    </PageWrapper>
  );
}
