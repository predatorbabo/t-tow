
import { getDoc, doc } from 'firebase/firestore';

// Mock the firebase modules. This will prevent the actual firebase from being initialized.
jest.mock('firebase/app', () => {
    return {
        initializeApp: jest.fn(() => {
            return {};
        }),
    };
});

jest.mock('firebase/firestore', () => {
    return {
        getFirestore: jest.fn(() => {
            return {};
        }),
        doc: jest.fn(),
        getDoc: jest.fn(),
    };
});

jest.mock('firebase/auth', () => {
    return {
        getAuth: jest.fn(() => {
            return {};
        }),
    };
});

// Import the db object from our firebase module. It will be a mocked object.
import { db } from './firebase';

describe('Firebase Connection', () => {
  it('should attempt to retrieve a document from firestore', async () => {
    // Arrange
    const mockDocSnap = { exists: () => true, data: () => ({ foo: 'bar' }) };
    (getDoc as jest.Mock).mockResolvedValue(mockDocSnap);

    // Act
    const docRef = doc(db, 'test', 'test');
    await getDoc(docRef);

    // Assert
    expect(doc).toHaveBeenCalledWith(db, 'test', 'test');
    expect(getDoc).toHaveBeenCalledWith(docRef);
  });
});
