import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Modal, Button} from 'react-bootstrap';
import PigForm from './PigForm';
import EditPigForm from "./EditPigForm";

const PigList = () => {

    const [searchCode, setSearchCode] = useState('');
    const [searchOrigin, setSearchOrigin] = useState('');








    const handleSearch = () => {
        axios.get('http://localhost:5000/pigs')
            .then(response => {
                const filteredPigs = response.data.filter(pig => {
                    return (searchCode === '' || pig.code.toLowerCase().includes(searchCode.toLowerCase())) &&
                        (searchOrigin === '' || pig.origin.toLowerCase().includes(searchOrigin.toLowerCase()));
                });
                setPigs(filteredPigs);
            })
            .catch(error => console.error(error));
    };


    // Bắt đầu xóa
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [pigToDelete, setPigToDelete] = useState(null);

    const handleDelete = (id) => {
        axios.delete(`http://localhost:5000/pigs/${id}`)
            .then(() => {
                fetchPigs();
                handleCloseDeleteModal();
            })
            .catch(error => console.error(error));
    };

    const handleOpenDeleteModal = (pig) => {
        setPigToDelete(pig);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setPigToDelete(null);
    };
    // Kết thúc xóa




    //Thêm mới 1 heo vào chuồng
    const [pigs, setPigs] = useState([]);
    const [showFormModal, setShowFormModal] = useState(false);

    useEffect(() => {
        fetchPigs();
    }, []);

    const fetchPigs = () => {
        axios.get('http://localhost:5000/pigs')
            .then(response => setPigs(response.data))
            .catch(error => console.error(error));
    };

    const handleOpenFormModal = () => {
        setShowFormModal(true);
    };

    const handleCloseFormModal = () => {
        setShowFormModal(false);
    };

    //Kết thúc thêm mới





    // xuất chuồng
    const [showEditModal, setShowEditModal] = useState(false); // Modal xuất chuồng
    const [selectedPig, setSelectedPig] = useState(null); // Lưu heo đang xuất chuồng
    const handleOpenEditModal = (pig) => {
        setSelectedPig(pig);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedPig(null);
    };

    const handleEditPig = (updatedPig) => {
        axios.put(`http://localhost:5000/pigs/${updatedPig.id}`, updatedPig)
            .then(() => {
                fetchPigs();
                handleCloseEditModal();
            })
            .catch(error => console.error(error));
    };
    //kết thúc xuất chuồng



    // phân trang
    const [currentPage, setCurrentPage] = useState(1); // Trạng thái trang hiện tại
    const [pigsPerPage] = useState(3); // Số heo trên mỗi trang
    const totalPigs = pigs.length; // Tổng số heo
    const totalPages = Math.ceil(totalPigs / pigsPerPage); // Tổng số trang
    const indexOfLastPig = currentPage * pigsPerPage; // Chỉ số của heo cuối cùng trên trang hiện tại
    const indexOfFirstPig = indexOfLastPig - pigsPerPage; // Chỉ số của heo đầu tiên trên trang hiện tại
    const currentPigs = pigs.slice(indexOfFirstPig, indexOfLastPig); // Dữ liệu heo hiển thị trên trang hiện tại

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
// kết thúc phân trang
    return (
        <div className={"container"}>
            <h2 className="text-center mb-4 text-danger-emphasis">Danh Sách Heo</h2>

            {/* Form Tìm kiếm */}
            <div className={"mb-2 d-flex align-items-center"}>
                <input
                    className={"form-control"}
                    style={{width:"40%", margin:"10px" }}

                    type="text"
                    placeholder="Tìm theo mã số heo"
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value)}
                />
                <input
                    className={"form-control"}
                    style={{width:"40%", margin:"10px" }}

                    type="text"
                    placeholder="Tìm theo xuất xứ"
                    value={searchOrigin}
                    onChange={(e) => setSearchOrigin(e.target.value)}
                />
                <button onClick={handleSearch} className={"btn btn-info"}>Tìm kiếm</button>
            </div>

            {/* Nút hiển thị modal form nhập chuồng */}
            <button className={"btn btn-primary mb-4"} onClick={handleOpenFormModal}><i class="fas fa-plus-circle"></i> Nhập
                chuồng heo mới

            </button>



            {/* Bảng hiển thị danh sách heo */}
            <table className={"table table-info table-hover table-striped table-bordered"}>
                <thead>
                <tr style={{ backgroundColor: "green" }}>
                    <th style={{ backgroundColor: "orange" }} className="table-header">Mã số heo</th>
                    <th style={{ backgroundColor: "orange" }} className="text-center">Ngày nhập chuồng</th>
                    <th style={{ backgroundColor: "orange" }} className="text-center">Trọng lượng nhập chuồng</th>
                    <th style={{ backgroundColor: "orange" }} className="text-center">Ngày xuất chuồng</th>
                    <th style={{ backgroundColor: "orange" }} className="text-center">Trọng lượng xuất chuồng</th>
                    <th style={{ backgroundColor: "orange" }} className="text-center">Tình trạng</th>
                    <th style={{ backgroundColor: "orange" }} className="text-center">Xuất xứ</th>
                    <th style={{ backgroundColor: "orange" }} className="text-center">Thao tác</th>
                </tr>
                </thead>
                <tbody className={"align-items-center"}>
                {currentPigs.map(pig => (
                    <tr key={pig.id} className="align-middle">
                        <td>{pig.code}</td>
                        <td>{pig.entryDate}</td>
                        <td>{pig.entryWeight} kg</td>
                        <td>{pig.exitDate ? pig.exitDate : 'Chưa đến ngày xuất'}</td>
                        <td>{pig.exitWeight || pig.entryWeight} kg</td>
                        <td>{pig.exitDate ? "Đã Bán" : "Chưa Bán"}</td>
                        <td>{pig.origin}</td>
                        <td>
                            <button className={"btn btn-danger bi bi-trash"}
                                    style={{margin:"10px"}}
                                    onClick={() => handleOpenDeleteModal(pig)}> Xóa
                            </button>
                            <button className={"btn btn-warning bi bi-save"}
                                    style={{margin:"10px"}}

                                    onClick={() => handleOpenEditModal(pig)}> Xuất chuồng
                            </button>

                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <nav>
                <ul className="pagination justify-content-center">
                    {[...Array(totalPages)].map((_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                                {index + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Modal chứa form nhập chuồng */}
            <Modal show={showFormModal} onHide={handleCloseFormModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Nhập Chuồng Mới</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <PigForm onSave={fetchPigs} onClose={handleCloseFormModal} pigs={pigs} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseFormModal}>Đóng</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Xác nhận xóa */}
            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
                <Modal.Header closeButton>
                    <Modal.Title className={"text-center text-danger mb-4"} >Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc chắn muốn xóa heo {pigToDelete?.code}?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeleteModal}>Đóng</Button>
                    <Button variant="danger" onClick={() => handleDelete(pigToDelete.id)}>Xóa</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showEditModal} onHide={handleCloseEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title className={"text-center text-warning mb-4"}>Xuất chuồng heo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditPigForm pig={selectedPig} onEdit={handleEditPig} onClose={handleCloseEditModal}/>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default PigList;
