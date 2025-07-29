import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaPlus, FaEdit, FaTrash, FaDownload, FaCar, FaEye } from 'react-icons/fa';

import Container from '../components/layout/Container';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import VehicleForm from '../components/admin/VehicleForm';
import DeleteConfirmDialog from '../components/admin/DeleteConfirmDialog';
import ExportControls from '../components/admin/ExportControls';

import { useCars, useDeleteVehicle, useExportCatalog } from '../hooks/useCars';
import type { Car } from '../types/car/car';

const AdminContainer = styled.div`
  background: ${({ theme }) => theme.colors.background.default};
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

const PasswordOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const PasswordCard = styled.div`
  background: white;
  padding: ${({ theme }) => theme.spacing.xxl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  max-width: 400px;
  width: 90%;
`;

const PasswordInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1.1rem;
  margin: ${({ theme }) => theme.spacing.lg} 0;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const AdminHeader = styled.div`
  background: white;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

const AdminTitle = styled.h1`
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  svg {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

const AdminContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    /* Usa CSS per il layout responsivo invece della prop */
  }
`;

const VehiclesSection = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: hidden;
`;

const SectionHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const VehiclesTable = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: ${({ theme }) => theme.spacing.md};
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  th {
    background: ${({ theme }) => theme.colors.background.default};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  tbody tr:hover {
    background: ${({ theme }) => theme.colors.background.default};
  }
`;

const VehicleImage = styled.img`
  width: 60px;
  height: 40px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const ActionButtonsCell = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const IconButton = styled.button`
  padding: ${({ theme }) => theme.spacing.xs};
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: background-color 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.background.default};
  }

  svg {
    font-size: 1rem;
  }

  &.edit {
    color: ${({ theme }) => theme.colors.info};
  }

  &.delete {
    color: ${({ theme }) => theme.colors.error};
  }

  &.view {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const PaginationContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const FormSidebar = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100vh;
  background: white;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transform: translateX(100%);
  transition: transform 0.3s ease;

  &.open {
    transform: translateX(0);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    width: 100%;
    right: 0;
  }
`;

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Car | null>(null);
  const [vehicleToDelete, setVehicleToDelete] = useState<Car | null>(null);
  const [page, setPage] = useState(1);
  const [showExportControls, setShowExportControls] = useState(false);

  const { data: vehiclesResult, isLoading } = useCars({}, page, 20);
  const deleteVehicle = useDeleteVehicle();
  const exportCatalog = useExportCatalog();

  useEffect(() => {
    const isAuth = sessionStorage.getItem('admin_authenticated') === 'true';
    setIsAuthenticated(isAuth);
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'rdgroup2025') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      setPasswordError('');
    } else {
      setPasswordError('Password non corretta');
    }
  };

  const handleAddNew = () => {
    setEditingVehicle(null);
    setShowForm(true);
  };

  const handleEdit = (vehicle: Car) => {
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const handleView = (vehicleId: string) => {
    navigate(`/auto/${vehicleId}`);
  };

  const handleDeleteClick = (vehicle: Car) => {
    setVehicleToDelete(vehicle);
  };

  const handleDeleteConfirm = async () => {
    if (vehicleToDelete) {
      await deleteVehicle.mutateAsync(vehicleToDelete.id);
      setVehicleToDelete(null);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingVehicle(null);
  };

  const handleExport = () => {
    setShowExportControls(true);
  };

  const handleExportWithOptions = async (options: any) => {
    try {
      await exportCatalog.mutateAsync(options);
      setShowExportControls(false);
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const formatPrice = (price: number) => {
    return `€${price.toLocaleString('it-IT')}`;
  };

  const formatMileage = (mileage: number) => {
    return `${mileage.toLocaleString('it-IT')} km`;
  };

  if (!isAuthenticated) {
    return (
      <PasswordOverlay>
        <PasswordCard>
          <h2>Accesso Admin</h2>
          <p>Inserisci la password per accedere al pannello amministrativo:</p>
          <form onSubmit={handlePasswordSubmit}>
            <PasswordInput
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            {passwordError && (
              <p style={{ color: 'red', margin: '8px 0' }}>{passwordError}</p>
            )}
            <Button type="submit" fullWidth>
              Accedi
            </Button>
          </form>
        </PasswordCard>
      </PasswordOverlay>
    );
  }

  return (
    <AdminContainer>
      <Container>
        <AdminHeader>
          <AdminTitle>
            <FaCar />
            Pannello Amministrativo
          </AdminTitle>
          
          <ActionButtons>
            <Button variant="primary" onClick={handleAddNew}>
              <FaPlus /> Aggiungi Veicolo
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <FaDownload /> Esporta Catalogo
            </Button>
          </ActionButtons>
        </AdminHeader>

        {/* Fix: Rimuovi la prop isFormOpen */}
        <AdminContent>
          <VehiclesSection>
            <SectionHeader>
              <h3>Veicoli in Catalogo ({vehiclesResult?.total || 0})</h3>
            </SectionHeader>

            {isLoading ? (
              <Loading type="spinner" size="md" text="Caricamento veicoli..." />
            ) : (
              <>
                <VehiclesTable>
                  <Table>
                    <thead>
                      <tr>
                        <th>Immagine</th>
                        <th>Marca</th>
                        <th>Modello</th>
                        <th>Anno</th>
                        <th>Prezzo</th>
                        <th>Km</th>
                        <th>Categoria</th>
                        <th>Azioni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehiclesResult?.cars.map((vehicle) => (
                        <tr key={vehicle.id}>
                          <td>
                            <VehicleImage
                              src={vehicle.images[0]?.url || '/placeholder-car.jpg'}
                              alt={`${vehicle.make} ${vehicle.model}`}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder-car.jpg';
                              }}
                            />
                          </td>
                          <td>{vehicle.make}</td>
                          <td>{vehicle.model}</td>
                          <td>{vehicle.year}</td>
                          <td>{formatPrice(vehicle.price)}</td>
                          <td>{formatMileage(vehicle.mileage)}</td>
                          <td>
                            <span style={{ 
                              background: vehicle.isLuxury ? 'gold' : 'gray',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              color: 'white',
                              fontSize: '0.8rem'
                            }}>
                              {vehicle.isLuxury ? 'Luxury' : 'Standard'}
                            </span>
                          </td>
                          <td>
                            <ActionButtonsCell>
                              <IconButton
                                className="view"
                                onClick={() => handleView(vehicle.id)}
                                title="Visualizza"
                              >
                                <FaEye />
                              </IconButton>
                              <IconButton
                                className="edit"
                                onClick={() => handleEdit(vehicle)}
                                title="Modifica"
                              >
                                <FaEdit />
                              </IconButton>
                              <IconButton
                                className="delete"
                                onClick={() => handleDeleteClick(vehicle)}
                                title="Elimina"
                              >
                                <FaTrash />
                              </IconButton>
                            </ActionButtonsCell>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </VehiclesTable>

                {vehiclesResult && vehiclesResult.total > 20 && (
                  <PaginationContainer>
                    <div>
                      Pagina {page} di {Math.ceil(vehiclesResult.total / 20)}
                    </div>
                    <div>
                      {page > 1 && (
                        <Button
                          variant="outline"
                          onClick={() => setPage(page - 1)}
                          style={{ marginRight: '8px' }}
                        >
                          Precedente
                        </Button>
                      )}
                      {vehiclesResult.hasMore && (
                        <Button
                          variant="outline"
                          onClick={() => setPage(page + 1)}
                        >
                          Successiva
                        </Button>
                      )}
                    </div>
                  </PaginationContainer>
                )}
              </>
            )}
          </VehiclesSection>
        </AdminContent>

        {showForm && (
          <VehicleForm
            vehicle={editingVehicle}
            onClose={handleFormClose}
            onSuccess={() => {
              handleFormClose();
              window.location.reload();
            }}
          />
        )}

        {vehicleToDelete && (
          <DeleteConfirmDialog
            vehicle={vehicleToDelete}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setVehicleToDelete(null)}
            isLoading={deleteVehicle.isPending}
          />
        )}

        {showExportControls && (
          <ExportControls
            onClose={() => setShowExportControls(false)}
            onExport={handleExportWithOptions}
            isLoading={exportCatalog.isPending}
          />
        )}
      </Container>
    </AdminContainer>
  );
};

export default AdminPage;